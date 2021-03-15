const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');

const keys = require('./api/keys')();
const User = require('./api/models/User');
const errorHandling = require('./api/lib/errorHandling')();
global.redis = require('./api/redis')(); //configured as global variable, so redis is accessible across all files

const app = express();
const server = require('http').Server(app);



/* API DOCS */
const swaggerDocument = require('./api/swagger.json');
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/* API DOCS */

/* MONGO */
const mongo_uri = keys.dbUrl;
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
/* MONGO */

/* PASSPORT AUTH */
require('./api/jwt-strategy')(User, passport, keys)
app.use(passport.initialize());
/* PASSPORT AUTH */

/* GENERAL MODULES */
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
/* GENERAL MODULES */

/*CORS*/
const corsSettings = require('./api/cors');
app.use(cors(corsSettings));
/*CORS*/

/* ROUTES */
app.use(require('./api/routes'))

app.use(express.static(path.join(__dirname, 'build')))

app.use('/api/*', (req, res, next) => {
    errorHandling.routeNotFound(next);
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use((err, req, res, next) => {
    errorHandling.throwError(err, res)
})
/* ROUTES */


/* CRON TASKS */
require('./api/tasks/task')();
/* CRON TASKS */


/* PROXY FOR DEV ENV */
if (process.env.NODE_ENV == 'development') {
    const { createProxyMiddleware } = require('http-proxy-middleware');
    app.use('/api', createProxyMiddleware({ target: 'http://localhost:8080' }));
}
/* PROXY FOR DEV ENV */

server.listen(process.env.PORT || 8080, function () {
    console.log(`Server listening on port ${process.env.PORT || 8080}`)
});

