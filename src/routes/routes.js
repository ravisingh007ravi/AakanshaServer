const express = require('express');
const { CreateUser,userOtpVerifucation, UserLogIn } = require('../controller/userController')

const routes = express.Router();

routes.post('/CreateUser', CreateUser)
routes.post('/userOtpVerifucation/:id', userOtpVerifucation)
routes.post('/LogInUser', UserLogIn)



routes.use((_, res) => { res.status(404).send({ status: false, msg: 'Invalid URL' }) });

module.exports = routes

 