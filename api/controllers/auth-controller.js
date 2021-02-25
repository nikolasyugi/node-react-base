const bcrypt = require('bcryptjs');
const User = require('../models/User');
const handle = require('../lib/errorHandling')().handle;
const keys = require('../keys')();
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
const mailer = require('../emails/mailer');
var jwt = require("jwt-simple");
const checkFields = require('../lib/checkFields');

module.exports = {

    async sign_in(req, res, next) {

        let [userFound, err] = await handle(User.findOne({ email: req.body.email }))
        if (err) next(err);
        else if (!userFound) return res.status(404).json({ message: "Usuário não encontrado" });
        else if (!userFound.verifyPassword(req.body.password)) return res.status(400).json({ message: "Senha inválida" });
        else return res.json({ name: userFound.name, email: userFound.email, token: jwt.encode(userFound._id, keys.jwtSecret) });;
    },

    async changePassword(req, res) {//change admin password

        let user = req.user;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;
        let newConfirmationPassword = req.body.newConfirmationPassword;

        if (newPassword.length < 8) return res.status(400).json({ message: 'Senha precisa ter pelo menos 8 digitos' })
        else if (newConfirmationPassword != newPassword) return res.status(400).json({ message: 'Senha e confirmação de senha são diferentes' })
        else if (!bcrypt.compareSync(oldPassword, req.user.password)) return res.status(400).json({ message: 'Senha antiga incorreta' })
        else {
            let hash = await bcrypt.hash(newPassword, 10)
            newPassword = hash;
            const [, error] = await handle(User.findByIdAndUpdate(
                user._id,
                {
                    $set: {
                        password: newPassword
                    }
                },
                { new: true }
            ));
            if (!error) return res.json({ message: 'Senha alterada com sucesso' });
            else next(error);
        }
    },

    async resetPassword(req, res, next) {
        var email = req.body.email;
        var email_token = uidgen.generateSync();

        if (!checkFields(["email"], req.body)) return res.status(400).json({ message: "Preencha todos os campos" })

        let [user, err] = await handle(User.findOne({ email: email }))
        if (err) next(err);
        else {
            if (!user) { //user not found
                mailer([{ email: email }], 'forgotPasswordNotFound', [email_token]);
            } else { //user found 
                user.new_password_token = email_token;
                user.new_password_token_generated = new Date();
                let [, err1] = await handle(user.save());
                if (err1) next(err1);
                else {
                    mailer([user], 'forgotPassword', [email_token]);
                }
            }
            return res.json({})
        }
    },

    async updatePassword(req, res, next) { //change users password

        var code = req.body.code;
        let newPassword = req.body.newPassword;
        let newConfirmationPassword = req.body.newConfirmationPassword;
        Date.prototype.addHours = function (h) {
            this.setTime(this.getTime() + (h * 60 * 60 * 1000));
            return this;
        }

        if (code) {
            let [user, err] = await handle(User.findOne({ new_password_token: code }))
            if (err) next(err);
            else {
                if (!user) { //user with that code not found
                    return res.status(400).json({ message: "Código Inválido" })
                } else if ((user.new_password_token_generated.addHours(1) - new Date() < 0)) { //(generated + 1h) < now ? true = expired
                    return res.status(400).json({ message: "Código Expirado" })
                } else { //user found and not expired
                    if (newPassword.length < 8) {
                        return res.status(400).json({ message: 'Senha precisa ter pelo menos 8 digitos' })
                    } else if (newConfirmationPassword != newPassword) {
                        return res.status(400).json({ message: 'Senha e confirmação de senha são diferentes' })
                    } else {
                        user.new_password_token_generated = null
                        user.new_password_token = null
                        user.password = newPassword;
                        user.save(function (err, userUpdated) {
                            if (err) throw err;
                            else return res.json({});
                        });
                    }
                }
            }
        } else { //normal change password
            if (req.user && req.user.role != "admin") {
                req.user = req.body.password;
                user.save(function (err, userUpdated) {
                    if (err) throw err;
                    else return res.json(userUpdated.mapUser());
                });
            } else {
                res.status(401).send({ message: "Você não está autenticado" })
            }
        }
    }

}