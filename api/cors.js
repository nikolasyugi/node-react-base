var whitelist = ['http://localhost:3000/', 'http://localhost:3000', 'http://localhost:8080/', 'http://localhost:8080']
module.exports = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || origin == undefined) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};