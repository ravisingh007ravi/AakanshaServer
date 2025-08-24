const mongoose = require("mongoose");
const { validName, validEmail, validPassword } = require('../validation/AllValidation');
const e = require("express");


const userShema = new mongoose.Schema({

    name: {
        type: String, trim: true,
        required: [true, "Please Enter a name"], validate: [validName, "Please Enter a valid name"]
    },
    email: {
        type: String, required: [true, 'Please Enter a email'], unique: true,
        validate: [validEmail, "Please Enter a valid email"], trim: true
    },
    password: {
        type: String, required: [true, 'Please Enter a password'],
        validate: [validPassword, "Please Enter a valid password"], trim: true
    },
    role: { type: String, enum: ['user', 'admin'], required: true, trim: true },
    verification: {
        user: {
            userOtp: { type: String, default: 0 },
            expireOtpTime: { type: String, default: 0 },
            isVerify: { type: Boolean, default: false },
            isDeleted: { type: Boolean, default: false },
            isAccountActive: { type: Boolean, default: true }
        },
        admin: {
            adminOtp: { type: String, default: 0 },
            expireOtpTime: { type: String, default: 0 },
            isVerify: { type: Boolean, default: false },
        }
    }

},
    { timestamps: true }
)

module.exports = mongoose.model("User", userShema)  