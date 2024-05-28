const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Function for updating a profile
exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", about = "", contactNumber } = req.body;
        const id = req.user.id;

        // Find Profile by id
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);

        // Update the profile fields
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;

        // Save the updated profile
        await profile.save();

        return res.json({
            success: true,
            message: "Profile updated successfully",
            profile,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
}

// Function for delete account
exports.deleteAccount = async (req, res) => {
    try {

        // Get the user id 
        const id = req.user.id;

        // Check if user is present or not
        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete Assosiated Profile with the User
        await Profile.findByIdAndDelete({ _id: user.additionalDetails });
        // TODO: Unenroll User From All the Enrolled Courses
        // Now Delete User
        await User.findByIdAndDelete({ _id: id });

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false, message: "User Cannot be deleted successfully"
        });
    }
}

// Function for get all user details
exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Function for update user profile picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

// Function for get enrolled courses
exports.getEnrolledCourses = async (req,res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findOne({
            _id: userId,
        }).populate("courses").exec();

        if(!userDetails){
            return res.status(400).json({
				success: false,
				message: "No course found",
			})
        }

        return res.status(200).json({
			success: true,
			data: userDetails.courses,
		})
    } catch (error) {
        return res.status(400).json({
			success: false,
			message: error.message,
		})
    }
}