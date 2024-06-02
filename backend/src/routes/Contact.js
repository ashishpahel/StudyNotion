const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {contactUs} = require("../controllers/ContactUs")

// Route for user login
router.post("/contact", contactUs)

// Export the router for use in the main application
module.exports = router