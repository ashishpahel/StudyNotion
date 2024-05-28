const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: `Email is required`,
            });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const updateDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000,
            },
            { new: true }
        )

        const url = `${APP_URL}update-password/${token}`;

        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        res.json({
            success: true,
            message:
                "Email Sent Successfully, Please Check Your Email to Continue Further",
        });

    } catch (error) {
        return res.json({
            success: false,
            message: `Some Error in Sending the Reset email`,
            error: error.message,
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (confirmPassword !== password) {
            return res.json({
                success: false,
                message: "Password and Confirm Password does not Match",
            });
        }

        const userDetails = await User.findOne({ token: token });

        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token is Invalid",
            });
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(403).json({
                success: false,
                message: 'Token is Expired, Please Regenerate Your Token',
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

         // Update user's password and clear the reset token and expiration
         userDetails.password = encryptedPassword;
         userDetails.resetPasswordToken = undefined;
         userDetails.resetPasswordExpires = undefined;
 
         await userDetails.save();

        return res.status(200).json({
            success: true,
            message: `Password Reset Successful`,
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message,
            success: false,
            message: `Some Error in Updating the Password`,
        });
    }
}