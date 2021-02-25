const User = require('../models/User');
const handle = require('../lib/errorHandling')().handle;
const s3Helper = require('../lib/s3Helper');
const checkFields = require('../lib/checkFields');

module.exports = {

    async getUsers(req, res, next) {
        const [users, error] = await handle(User.aggregate([
            { "$match": { "role": null } },
        ]).sort({ field: 'asc', name: 1 }))

        if (!error) res.json(users);
        else next(error);

    },

    async getUser(req, res, next) {
        const [user, error] = await handle(User.findOne({ _id: req.params.userId }))

        if (!error) res.json(user);
        else next(error);

    },

    async createUser(req, res, next) {

        const [found,] = await handle(User.find({ email: req.body.email }))
        if (found.length) return res.status(400).json({ message: "Usuário já existe" });

        if (!checkFields(["name", "email", "password"], req.body)) return res.status(400).json({ message: "Preencha todos os campos" })

        const pictureTypes = ["png", "jpg", "jpeg"];

        if (!Date.parse(req.body.birthday)) return res.status(400).json({ message: "Data inválida" });

        let user = {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            birthday: req.body.birthday,
            picture: null,
            email: req.body.email,
            password: req.body.password,
            role: null
        }

        s3Helper.upload(res, req.file, pictureTypes, async (url) => {
            user.picture = url;
            const [userCreated, error1] = await handle(User.create(user))
            if (!error1) res.json(userCreated);
            else next(error1)
        });
    },

    async updateUser(req, res, next) {

        const [oldUser, error] = await handle(User.findOne({ _id: req.body.id }))

        if (!Date.parse(req.body.birthday)) return res.status(400).json({ message: "Data inválida" });

        const pictureTypes = ["png", "jpg", "jpeg"];

        if (error) next(error);
        else {

            oldUser.name = req.body.name;
            oldUser.address = req.body.address;
            oldUser.phone = req.body.phone;
            oldUser.birthday = req.body.birthday;

            s3Helper.delete(res, oldUser.picture, req.file, async () => {
                s3Helper.upload(res, req.file, pictureTypes, async (url) => {
                    url != null ? oldUser.picture = url : oldUser.picture = oldUser.picture;
                    oldUser.save(function (err, userUpdated) {
                        if (err) throw err;
                        else return res.json({});
                    });
                });
            });
        }

    },

    async deleteUser(req, res, next) {

        const [user, error] = await handle(User.findOne({ _id: req.params.userId }))

        s3Helper.delete(res, user.picture, 1, async () => {
            const [, error1] = await handle(User.deleteOne({
                _id: req.params.userId,
            }));

            if (!error1) res.json({});
            else next(error1);
        })
    }
}