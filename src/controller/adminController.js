const userModel = require('../model/UserModel')
const { AllError } = require('../error/errorhandling')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { verifyUserOtp } = require('../mail/nodemail')

exports.getAllUserData = async (req, res) => {
    try {
        const data = await userModel.find()
        return res.status(200).send({ status: true, data: data })
    }
    catch (e) { AllError(e, res) }
}


exports.AdminLogIn = async (req, res) => {
    try {
        const data = req.body;

        const { email, password } = data;

        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        const expireOtpTime = (Math.floor(Date.now() / 1000) + 5 * 60);

        const DB = await userModel.findOneAndUpdate({ email },
            {
                $set: {
                    'verification.admin.adminOtp': randomOtp,
                    'verification.admin.expireOtpTime': expireOtpTime,
                }
            })

        if (!DB) return res.status(400).send({ status: false, msg: "Admin not found" })

        if (DB.role == 'user') return res.status(400).send({ status: false, msg: 'User not Authroized for LogIn' })

        const isMatch = await bcrypt.compare(password, DB.password)

        if (!isMatch) return res.status(400).send({ status: false, msg: "Wrong password" })

        const token = jwt.sign({ adminId: DB._id }, process.env.AdminTokenKey, { expiresIn: '12h' })

        // verifyUserOtp(DB.email, DB.name, randomOtp);

        res.status(200).send({ status: true, msg: "Successfully Send Otp", UserToken: token, UserId: DB._id })
    }
    catch (err) { AllError(err, res) }
}


exports.AdminOtpVerification = async (req, res) => {
    try {
        const otp = req.body.otp;
        const id = req.params.id;

        if (!otp) return res.status(400).send({ status: false, msg: "pls Provide OTP" });

        const DB = await userModel.findById(id)
        if (!DB) return res.status(400).send({ status: false, msg: "Admin not found" })
        const expireOtpTime = Math.floor(Date.now() / 1000);
        
        if (!(DB.verification.admin.expireOtpTime > expireOtpTime)) return res.status(400).send({ status: false, msg: "Otp Expired" });

        if (DB.verification.admin.adminOtp != otp) return res.status(400).send({ status: false, msg: "Wrong Otp" });

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { 'verification.admin.adminOtp': Math.floor(1000 + Math.random() * 9000) } }, { new: true });

        res.status(200).send({ status: true, msg: "Successfully Send Otp", })
    }
    catch (err) { AllError(err, res) }
}