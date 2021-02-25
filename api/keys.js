module.exports = function () {

	const dotenv = require('dotenv');
	dotenv.config();

	keys = {
		redisUrl: process.env.REDIS_URL,
		webUrl: process.env.WEB_URL,
		configEmail: {
			email: process.env.EMAIL,
			password: process.env.EMAIL_PASSWORD
		},
		dbUrl: process.env.MONGO_URL,
		google: {
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			refreshToken: process.env.GOOGLE_REFRESH_TOKEN
		},
		aws: {
			accessKeyId: process.env.AWS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_KEY,
			region: process.env.REGION,
			bucketName: process.env.BUCKET_NAME
		},
		projectName: process.env.PROJECT_NAME,
		jwtSecret: process.env.JWT_SECRET
	}

	return keys;
}