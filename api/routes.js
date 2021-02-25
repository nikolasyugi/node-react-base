const express = require('express');
let multer = require('multer');
let upload = multer();

const routes = new express.Router();

const middlewares = require('./middlewares/auth')

const userController = require('./controllers/user-controller')
const faqController = require('./controllers/faq-controller')
const superUserController = require('./controllers/superUser-controller')
const authController = require('./controllers/auth-controller')


//Auth controller
routes.post('/api/sign_in', authController.sign_in)
routes.put('/api/changePassword', middlewares.checkToken, middlewares.checkAdmin, authController.changePassword) //only admin
routes.put('/api/password', authController.updatePassword) //forgot password and not admin
routes.post('/api/resetPassword', authController.resetPassword)

//User controller
routes.get('/api/users', middlewares.checkToken, middlewares.checkAdmin, userController.getUsers)
routes.get('/api/users/:userId', middlewares.checkToken, middlewares.checkAdmin, userController.getUser)
routes.post('/api/users', middlewares.checkToken, middlewares.checkAdmin, upload.single('picture'), userController.createUser)
routes.put('/api/users', middlewares.checkToken, middlewares.checkAdmin, upload.single('picture'), userController.updateUser)
routes.delete('/api/users/:userId', middlewares.checkToken, middlewares.checkAdmin, userController.deleteUser)

//Faq controller
routes.get('/api/faqs', middlewares.checkToken, middlewares.checkAdmin, faqController.getFaqs)
routes.get('/api/faqs/:faqId', middlewares.checkToken, middlewares.checkAdmin, faqController.getFaq)
routes.post('/api/faqs', middlewares.checkToken, middlewares.checkAdmin, faqController.createFaq)
routes.put('/api/faqs', middlewares.checkToken, middlewares.checkAdmin, faqController.updateFaq)
routes.delete('/api/faqs/:faqId', middlewares.checkToken, middlewares.checkAdmin, faqController.deleteFaq)

//SuperUser controller
routes.get('/api/superUsers', middlewares.checkToken, middlewares.checkAdmin, superUserController.getSuperUsers)
routes.get('/api/superUsers/:superUserId', middlewares.checkToken, middlewares.checkAdmin, superUserController.getSuperUser)
routes.post('/api/superUsers', middlewares.checkToken, middlewares.checkAdmin, superUserController.createSuperUser)
routes.put('/api/superUsers', middlewares.checkToken, middlewares.checkAdmin, superUserController.updateSuperUser)
routes.delete('/api/superUsers/:superUserId', middlewares.checkToken, middlewares.checkAdmin, superUserController.deleteSuperUser)

module.exports = routes;