const Section = require("../models/Section");
const SubSection = require("../models/Subsection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Function for create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
    try {
        const { sectionId, title, description } = req.body
        const video = req.files.video

        // Check if all necessary fields are provided
        if (!sectionId || !title || !description || !video) {
            return res.status(404).json({
                success: false,
                message: "All Fields are Required"
            })
        }

        // Upload the video file to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        )

        // Create a new sub-section with the necessary information
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })

        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
        ).populate("subSection")

        res.status(200).json({
            success: true,
            message: "subsection created successfully",
            updatedSection,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Something Went Wrong",
            error: error.message,
        });
    }
}

// Function for update a sub-section for a given section
exports.updateSubSection = async (req, res) => {
    try {

        // Extract the necessary data from the request body
        const { sectionId, title, description } = req.body;

        // Validate the input
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "sectionId is required",
            });
        }

        // Find the subsection by its ID
        const subSection = await SubSection.findById(sectionId);

        // Check if the subsection exists
        if (!subSection) {
            return res.status(400).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // Update the subsection properties
        if (title !== undefined) {
            subSection.title = title;
        }

        if (description !== undefined) {
            subSection.description = description;
        }

        // Upload video to Cloudinary if included in the request
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        // Save the updated subsection
        await subSection.save();

        // Return success response
        return res.json({
            success: true,
            message: "Section updated successfully",
        });


    } catch (error) {
        console.error("Error updating section:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
            error: error.message,
        });
    }
}


// Function for delte a sub-section for a given section
exports.deleteSubSection = async (req, res) => {
    try {
        // Extract the necessary data from the request body
        const { subSectionId, sectionId } = req.body;

        // Validate the input
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId and sectionId are required",
            });
        }

        // Update the corresponding section to remove the subSectionId
        await Section.findByIdAndUpdate(
            sectionId,
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        );


        // Delete the subSection
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        // Check if the subSection exists
        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
        });
    } catch (error) {
        // Handle errors
        console.error("Error deleting SubSection:", error);
        return res.status(400).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
            error: error.message,
        });
    }

}