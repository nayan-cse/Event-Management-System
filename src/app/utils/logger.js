// utils/logger.js
const winston = require('winston');
const { format, transports } = winston;
const path = require('path');

// Create a log file with the current date
const logFileName = () => {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(__dirname, `../logs/${date}.log`);
};

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: logFileName() }),
    ],
});

module.exports = logger;
