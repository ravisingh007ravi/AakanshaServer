const express = require('express');
const { CreateUser, userOtpVerifucation, UserLogIn, resendUserOtp, uploadProfileImg } = require('../controller/userController')
const { getAllUserData, AdminLogIn, AdminOtpVerification } = require('../controller/adminController')
const { userAuthentication, userAuthorization } = require('../middleware/userAuth')
const { adminAuthentication, adminAuthorization } = require('../middleware/AdminAuth')
const multer = require('multer')
const routes = express.Router();

const upload = multer({ storage: multer.diskStorage({}) });

// User Api's
routes.post('/CreateUser', CreateUser)
routes.get('/resendUserOtp/:id', resendUserOtp)
routes.post('/userOtpVerification/:id', userOtpVerifucation)
routes.post('/LogInUser', UserLogIn)
routes.put('/uploadProfileImg/:id', upload.single('profileimg'), userAuthentication, userAuthorization, uploadProfileImg)

// Admin Api's
routes.get('/getAllUserData', adminAuthentication, getAllUserData)
routes.post('/LogInAdmin', AdminLogIn)
routes.post('/admin_otp_verification/:id', adminAuthentication, adminAuthorization, AdminOtpVerification)


routes.use((_, res) => { res.status(404).send({ status: false, msg: 'Invalid URL' }) });

module.exports = routes

