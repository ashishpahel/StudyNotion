const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const logger = require("../utils/logger");
const { emailVerificationTemplate } = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },

        otp: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 5 * 60, // The document will be automatically deleted after 5 minutes of its creation time
        }
    }, { timestamps: true }
);


async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email", emailVerificationTemplate(otp));
        logger.info("email send successfully: ", mailResponse);
    } catch (error) {
        logger.error("error occured while sending mails: ", error);
        throw error;
    }
}


OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})


module.exports = mongoose.model("OTP", OTPSchema);