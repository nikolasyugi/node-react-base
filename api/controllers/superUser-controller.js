const User = require('../models/User');
const handle = require('../lib/errorHandling')().handle;
const checkFields = require('../lib/checkFields');

module.exports = {

    async getSuperUsers(req, res, next) {
        const [superUsers, error] = await handle(User.find({ role: "admin", email: { $ne: "nikolas.yugi@gmail.com" }, _id: { $ne: req.user._id } }, 'name email phone').sort({ field: 'asc', name: 1 }))

        if (!error) res.json(superUsers);
        else next(error);

    },

    async getSuperUser(req, res, next) {
        const [superUser, error] = await handle(User.findOne({ role: "admin", _id: req.params.superUserId }))

        if (!error) res.json(superUser);
        else next(error);

    },

    async createSuperUser(req, res, next) {

        if (!checkFields(["name", "email", "phone", "password"], req.body)) return res.status(400).json({ message: "Preencha todos os campos" })

        const [found,] = await handle(User.find({ email: req.body.email }))
        if (found.length) return res.status(400).json({ message: "Usuário já existe" });

        const superUser = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            role: "admin"
        }

        const [superUserCreated, error] = await handle(User.create(superUser))

        if (!error) res.json(superUserCreated);
        else next(error);

    },


    async updateSuperUser(req, res, next) {
        const [updatedSuperUser, error] = await handle(User.findByIdAndUpdate(
            req.body.id,
            {
                $set: {
                    name: req.body.name,
                    phone: req.body.phone
                }
            },
            { new: true }
        ));
        if (!error) res.json(updatedSuperUser);
        else next(error);

    },

    async deleteSuperUser(req, res, next) {
        const [, error] = await handle(User.deleteOne({
            _id: req.params.superUserId,
        }));

        if (!error) res.json({});
        else next(error);
    }
}