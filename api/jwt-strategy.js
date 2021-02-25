module.exports = (User, passport, keys) => {

	const passportJWT = require("passport-jwt");
	const JwtStrategy = passportJWT.Strategy;
	const ExtractJwt = passportJWT.ExtractJwt;

	const opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = keys.jwtSecret;

	passport.use(new JwtStrategy(opts,
		(jwt_payload, done) => {
			User.findById(jwt_payload, (err, userFound) => {
				if (err) { 
					return done(err, null); }
				if (!userFound) {return done(null, false, { message: "Usuário não encontrado" }); }
				return done(null, userFound);
			})
		}
	));
}