const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: process.env.NodeMailerUserName,
        pass: process.env.NodeMailerPassword,
    },
});
exports.verifyUserOtp = async (name, email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: '',
            to: email,
            subject: "Superbike Garage - OTP Verification",
            text: `Your OTP is: ${otp}`,
            html: `
              <div style="font-family: 'Segoe UI', sans-serif; background-color: #0f0f0f; color: #ffffff; padding: 20px; border-radius: 10px;">
                <div style="text-align: center;">
                  <img src="https://i.ibb.co/zQktPtv/superbike-banner.jpg" alt="Superbike" style="max-width: 100%; border-radius: 8px;" />
                </div>
                <h2 style="color: #f00c0c; text-align: center; margin-top: 20px;">🔥 Superbike Garage OTP Verification 🔥</h2>
                <p style="font-size: 16px; line-height: 1.6;">Hey <strong>${name}</strong>,</p>
                <p>Thanks for signing up at <strong>Superbike Garage</strong>! To proceed, please use the OTP below to verify your email address:</p>
                <div style="background: #1f1f1f; padding: 15px; text-align: center; border: 2px dashed #f00c0c; border-radius: 8px; margin: 20px 0;">
                  <h1 style="font-size: 32px; color: #f00c0c;">${otp}</h1>
                </div>
                <p>This OTP is valid for the next <strong>10 minutes</strong>. Do not share it with anyone.</p>
                <p>Ride fast. Ride safe. 🏍️</p>
                <p style="margin-top: 30px;">Cheers,<br/>The Superbike Garage Team</p>
              </div>
            `
        });

        console.log("Message sent:", info.messageId);
    } catch (err) {
        console.log(err);
    }
}
