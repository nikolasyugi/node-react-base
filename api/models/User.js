const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    birthday: Date,
    phone: String,
    role: String, //"admin" or null 
    meetings_attended: [{ type: mongoose.Schema.ObjectId, ref: 'Meeting' }],
    password: {
        type: String, required: true, validate: {
            validator: function (p) {
                return p.length >= 8;
            },
            message: props => `Password length must be greater than 8!`
        },
    },
    new_password_token: String,
    new_password_token_generated: Date
},
    {
        timestamps: true
    });

// on every save hash password
UserSchema.pre('save', function (next) {
    //hash password
    if (this.password != undefined) {
        return bcrypt.hash(this.password, 10)
            .then(hash => {
                this.password = hash;
            })
            .catch(err => {
                throw new Error();
            });
    }
    next();
});

UserSchema.methods.verifyPassword = function (passwordSent) {
    return bcrypt.compareSync(passwordSent, this.password);
};

module.exports = mongoose.model('User', UserSchema);