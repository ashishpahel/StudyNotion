const nodemailer = require("nodemailer");
const logger = require('../utils/logger');

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from: 'StudyNotion || Ashish Pahel',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })

        return info;
        
    } catch (error) {
        logger.error(error.message);
    }
}

module.exports = mailSender;