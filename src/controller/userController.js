const userModel = require('../model/UserModel')
const { validName, validEmail, validPassword } = require('../validation/AllValidation')
const { verifyUserOtp } = require('../mail/nodemail')
const bcrypt = require('bcrypt')
const { UserLoadImg, deleteProfileImg } = require('../images/UploadImg')
const jwt = require('jsonwebtoken')
const { AllError } = require('../error/errorhandling')
require('dotenv').config()

exports.CreateUser = async (req, res) => {

    try {
        const data = req.body;

        const { name, email, password } = data

        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        const existingUser = await userModel.findOneAndUpdate({ email }, { $set: { 'verification.user.userOtp': randomOtp } })


        if (existingUser) {
            const DBDATABASE = { name: existingUser.name, email: existingUser.email, _id: existingUser._id }
            const userVerification = existingUser.verification?.user || {};
            if (userVerification.isDeleted) return res.status(400).send({ status: false, msg: 'User already deleted' });
            if (userVerification.isVerify) return res.status(400).send({ status: false, msg: 'Account already verified, please login' });
            if (!userVerification.isAccountActive) return res.status(400).send({ status: false, msg: 'User is blocked by admin' });

            verifyUserOtp(existingUser.name, existingUser.email, randomOtp);
            return res.status(200).send({ status: true, msg: 'OTP sent successfully', data: DBDATABASE });
        }

        const hashPassword = await bcrypt.hash(password, 10)

        data.verification = {};
        data.verification.user = {};

        data.password = hashPassword
        data.verification.user.userOtp = randomOtp
        data.role = 'user'

        verifyUserOtp(name, email, randomOtp)
        const DB = await userModel.create(data)

        const DBData = { name: DB.name, email: DB.email, _id: DB._id }

        res.status(201).send({ status: true, msg: "Successfully created Data", data: DBData })
    }
    catch (error) { AllError(error, res) }

}


exports.resendUserOtp = async (req, res) => {
    try {
        const id = req.params.id;

        const DB = await userModel.findById(id)
        if (!DB) return res.status(400).send({ status: false, msg: "User not found" })

        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        DB.verification.user.userOtp = randomOtp

        await DB.save()
        verifyUserOtp(DB.name, DB.email, randomOtp);
        res.status(200).send({ status: true, msg: "OTP sent successfully" })
    }
    catch (err) { res.status(500).send({ status: false, msg: err.message }) }
}

exports.userOtpVerifucation = async (req, res) => {
    try {
        const id = req.params.id;
        const otp = req.body.otp;
        const data = req.body

        if (!otp) return res.status(400).send({ status: false, msg: "pls Provide OTP" })

        const DB = await userModel.findById(id)
        if (!DB) return res.status(400).send({ status: false, msg: "User not found" })

        data.verification = {};
        data.verification.user = {};
        if ((DB.verification.user.isVerify)) return res.status(400).send({ status: false, msg: 'Account already verified, please login' });

        if (!(otp == DB.verification.user.userOtp)) return res.status(400).send({ status: false, msg: 'Wrong otp' });

        await userModel.findByIdAndUpdate(id, { $set: { 'verification.user.isVerify': true } })
        res.status(200).send({ status: true, msg: "Account verified successfully" })
    }
    catch (error) { AllError(error, res) }
}


exports.UserLogIn = async (req, res) => {
    try {
        const data = req.body;

        const { email, password } = data;

        const DB = await userModel.findOne({ email })

        if (!DB) return res.status(400).send({ status: false, msg: "User not found" })

        const userVerification = DB.verification?.user || {};

        if (DB.role == 'admin') return res.status(400).send({ status: false, msg: 'Your not Authroized' })

        if (userVerification.isDeleted) return res.status(400).send({ status: false, msg: 'User already deleted' });
        if (!userVerification.isVerify) return res.status(400).send({ status: false, msg: 'Account not verify , please Sign Up' });
        if (!userVerification.isAccountActive) return res.status(400).send({ status: false, msg: 'User is blocked by admin' });

        const isMatch = await bcrypt.compare(password, DB.password)

        if (!isMatch) return res.status(400).send({ status: false, msg: "Wrong password" })

        const token = jwt.sign({ userId: DB._id }, process.env.UserTokenKey, { expiresIn: '12h' })

        const DBDATA = {
            profileimg: DB.profileimg,
            name: DB.name,
            email: DB.email,
        }
        res.status(200).send({ status: true, msg: "Successfully Created Token", UserToken: token, UserId: DB._id, data: DBDATA })
    }
    catch (err) { AllError(err, res) }
}


exports.uploadProfileImg = async (req, res) => {
    try {

        const id = req.params.id
        const img = req.file
        if (!img) return res.status(400).send({ status: false, msg: "img must be present" })
        if (!id) return res.status(400).send({ status: false, msg: "id must be present" })

        const checkUser = await userModel.findById(id)

        if (!checkUser) return res.status(400).send({ status: false, msg: "User not found" })

        if (checkUser.profileimg?.public_id) {
            deleteProfileImg(checkUser.profileimg.public_id)
        }
        const imgData = await UserLoadImg(img.path)

        const updateUserDB = await userModel.findByIdAndUpdate({ _id: id }, { $set: { 'profileimg': imgData } }, { new: true });

        const DBDATA = {
            profileimg: updateUserDB.profileimg,
            name: updateUserDB.name,
            email: updateUserDB.email,
        }

        res.status(200).send({ status: true, msg: "Successfully uploaded img", data: DBDATA })
    }
    catch (err) { AllError(err, res) }
}