const mailSender = require("../utils/mailSender");
const { contactDetailsTemplate } = require("../mail/templates/contactUs");


exports.contactUs = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNo,
            message,
        } = req.body;

        // Check if All Details are provided
        if (!firstName || !lastName || !email || !phoneNo || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const emailResponse = await mailSender(process.env.ENQUIRY_MAIL,
            "Enquiry Form",
            contactDetailsTemplate(firstName, lastName, email, phoneNo, message));

        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });

    } catch (error) {
        console.error("Error occurred while sending email:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
        });
    }
}