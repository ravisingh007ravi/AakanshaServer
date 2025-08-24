const express = require('express');
const { CreateUser, userOtpVerifucation, UserLogIn, resendUserOtp } = require('../controller/userController')
const { getAllUserData, AdminLogIn, AdminOtpVerification } = require('../controller/adminController')
const { userAuthentication } = require('../middleware/userAuth')
const { adminAuthentication, adminAuthorization } = require('../middleware/AdminAuth')
const routes = express.Router();

// User Api's
routes.post('/CreateUser', CreateUser)
routes.get('/resendUserOtp/:id', resendUserOtp)
routes.post('/userOtpVerification/:id', userOtpVerifucation)
routes.post('/LogInUser', UserLogIn)

// Admin Api's
routes.get('/getAllUserData', userAuthentication, getAllUserData)
routes.post('/LogInAdmin', AdminLogIn)
routes.post('/admin_otp_verification/:id', adminAuthentication, adminAuthorization, AdminOtpVerification)


routes.use((_, res) => { res.status(404).send({ status: false, msg: 'Invalid URL' }) });

module.exports = routes

