const mongoose = require("mongoose");


const userShema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: ['user', 'admin'], required: true, trim: true },
    verification: {
        user: {
            userOtp: { type: String, default: 0 },
            isVerify: { type: Boolean, default: false },
            isDeleted: { type: Boolean, default: false },
            isAccountActive: { type: Boolean, default: true }
        },
        admin: {
            adminOtp: { type: String, default: 0 },
            isVerify: { type: Boolean, default: false },
        }
    }

},
    { timestamps: true }
)

module.exports = mongoose.model("User", userShema)  