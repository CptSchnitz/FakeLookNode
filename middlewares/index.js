const config = require("config");
const winston = require("winston");
const expressWinston = require("express-winston");
const logPaths = config.get("server.log.paths");

const accessLogger = expressWinston.logger({
    transports: [new winston.transports.File({ filename: logPaths.access })],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp()
    )
});

const errorLogger = expressWinston.errorLogger({
    transports: [new winston.transports.File({ filename: logPaths.error })],
    format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp()
    ),
    skip: req => res.status < 500
});

// handle errors
const errorHandler = function(err, req, res, next) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
};


module.exports = { errorHandler, accessLogger, errorLogger };
