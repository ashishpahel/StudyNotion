const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
    try {
        // Get user ID from req body
        const userID = req.user.id;

        // get all required fields from req body
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instructions,
        } = req.body;

        // Get thumbnail image from request files
        const thumbnail = req.files.thumbnailImage;

        // Check if any of the required fields are missing
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag ||
            !thumbnail ||
            !category ||
            !instructions
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }

        if (!status || status === undefined) {
            status = "Draft";
        }

        // Check if the user is an instructor
        const instructorDetails = await User.findOne({
            _id: userId,           
            accountType: "Instructor" 
        });

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }

        // Check if the category given is valid
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            });
        }

        // Upload the Thumbnail to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        );
        console.log(thumbnailImage);

        const newCourse = await Course.create({
            courseName: courseName,
            courseDescription: courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price: price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions: instructions,
        });

        // Add the new course to the Categories
        await Category.findByIdAndUpdate(
            { _id: category },
            { $push: { course: newCourse._id } },
            { new: true }
        )

        // Return the new course and a success message
        res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
}