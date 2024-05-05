const winston = require('winston');

// Configure the logger
const logger = winston.createLogger({
    level: 'info', 
    format: winston.format.json(), // Format logs as JSON
    transports: [
        new winston.transports.File({ filename: 'logfile.log' }) // Log to a file
    ],
});



module.exports = logger;
