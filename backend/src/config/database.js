const mongoose = require("mongoose");
const logger = require('../utils/logger');
require("dotenv").config();


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        logger.info(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);   
    } catch (error) {
        console.log("MONGODB connection FAILED ", error.message);
        logger.error("MONGODB connection FAILED ", error.message);
        process.exit(1)
    }
}

module.exports = connectDB;