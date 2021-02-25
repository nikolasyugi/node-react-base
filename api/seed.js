/***************************/
var name = "Admin"
var email = "admin@gmail.com"
var phone = "(11) 9 1234 5678"
var password = "12345678"
/***************************/




const mongoose = require('mongoose')
const User = require('./models/User');
const keys = require('./keys')()

mongoose.connect(keys.dbUrl, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

var u = new User({
	name: name,
	email: email,
	phone: phone,
	password: password,
	role: 'admin'
})

User.findOne({ role: "admin", email: email }, function (err, user) {
	if (err) throw err;
	else {
		if (!user) {
			u.save(function (err, user) {
				if (err) {
					throw err;
				}
				else {
					console.log('User created successfully')
					process.exit(0)
				}
			});
		}
		else {
			console.log('User already exists')
			process.exit(0)
		}
	}
});
