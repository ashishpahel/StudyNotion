const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

// Signup Controller for Registering USers

exports.signup = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        // Check if All Details are provided
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        // Find the most recent OTP for the email
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            })
        } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine approval status based on account type
        const approved = accountType === "Instructor" ? false : true;

        // Create the user
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: Number,
        })

        const user = await User.create({
            firstName: firstName, 
            lastName: lastName,
            email: email,
            contactNumber: contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
            error: error.message,
        });
    }
}

// Login controller for authenticating users

exports.login = async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }

        // Find user with provided email 
        const user = await User.findOne({ email }).populate("additionalDetails")

        // If user not found with provided email
        if (!user) {
            return res.status(400).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }

        // Generate JWT token and Compare Password
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                id: user._id,
                email: user.email,
                accountType: user.accountType,
            };

            const options = {
                expiresIn: '24h',
            };

            const secret = process.env.JWT_SECRET;

            const token = jwt.sign(payload, secret, options);

            // Update user document with the token
            user.token = token;
            await user.save();

            // Set cookie for token and return success response

            const cookieOptions = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, cookieOptions).status(200).json({
                success: true,
                token,
                user,
                message: "User Login Success"
            })
        } else {
            return res.status(400).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
            error: error.message,
        });
    }
}

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email or password is missing
        if (!email) {
            return res.status(400).json({
                success: false,
                message: `Email is required`,
            });
        }

        // Check if user is already present 
        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: `User is Already Registered`,
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const otpBody = await OTP.create({
            email: email,
            otp: otp,
        })

        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: `OTP Sent failed`,
            error: error.message,
        });
    }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
        // Get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // Validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );

        if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res.status(400).json({
                success: false,
                message: "The password is incorrect"
            });
        }

        // Match new password and confirm new password
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            });
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
            { password: encryptedPassword },
            { new: true });

        // Send notification email
        try {
            const emailResponse = await mailSender(updatedUserDetails.email,
                "Password Update Confirmation",
                passwordUpdated(updatedUserDetails.email, updatedUserDetails.firstName + " " + updatedUserDetails.lastName));

            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
}