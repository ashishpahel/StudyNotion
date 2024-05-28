const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************


// Route for delete user account
router.delete("/deleteProfile", auth, deleteAccount)

// Route for update user profile
router.put("/updateProfile", auth, updateProfile)

// Route for get user details
router.get("/getUserDetails", auth, getAllUserDetails)

// Route for get enrolled course
router.get("/getEnrolledCourses", auth, getEnrolledCourses)

// Route for update display picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router