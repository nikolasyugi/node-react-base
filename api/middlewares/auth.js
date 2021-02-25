const passport = require('passport');

module.exports = {

	async checkToken(req, res, next) {
		await passport.authenticate('jwt', { session: false }, (err, user, info) => {
			if (err || !user) return res.status(401).send({ message: "Você não está autenticado" });
			else req.user = user; next();
		})(req, res, next);
	},

	async checkAdmin(req, res, next) {
		if (!req.user || (req.user.role != 'admin' && req.user.role != 'member')) return res.status(401).send({ message: "Você não está autenticado" })
		next();
	}
}