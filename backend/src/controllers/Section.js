const Section = require("../models/Section");
const Course = require("../models/Course");

// Function for create a new section
exports.createSection = async (req, res) => {
    try {
        // Extract the required properties from the request body
        const { sectionName, courseId } = req.body;

        // Validate the input
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Create a new section with the given name
        const newSection = await Section.create({ sectionName });

        // Add the new section to the course's content array
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true }
        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        // Return the updated course object in the response
        res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
        });


    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Something Went Wrong",
            error: error.message,
        });
    }
}

// Function for update a section
exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;

        // Validate the input
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "section update successfully",
            data: section,
        });
    } catch (error) {
        console.error("Error updating section:", error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
}

// Function for delete a section
exports.deleteSection = async (req, res) => {
    try {

        const { sectionId } = req.params;

        // Validate the input
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "sectionId is required",
            });
        }

        // Find the section to be deleted
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        if (!deletedSection) {
            return res.status(400).json({
                success: false,
                message: "Section not found",
            });
        }

        // Update the corresponding course to remove the deleted section from the courseContent array
        const updatedCourse = await Course.findOneAndUpdate(
            { courseContent: sectionId },
            { $pull: { courseContent: sectionId } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Section deleted",
            updatedCourse,
        });

    } catch (error) {
        console.error("Error deleting section:", error);
        res.status(400).json({
            success: false,
            message: "Something Went Wrong",
            error: error.message,
        });
    }
};