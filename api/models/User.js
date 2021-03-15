const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    birthday: Date,
    phone: String,
    role: String, //"admin" or null 
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
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.verifyPassword = function (passwordSent) {
    return bcrypt.compareSync(passwordSent, this.password);
};

module.exports = mongoose.model('User', UserSchema);