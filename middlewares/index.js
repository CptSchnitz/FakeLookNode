const config = require('config');
const winston = require('winston');
const expressWinston = require('express-winston');

const logPaths = config.get('server.log.paths');

const accessLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: logPaths.access })],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple(),
  ),
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: logPaths.error })],
  format: winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.timestamp(),
  ),
  skip: (req, res) => res.status < 500,
});

// handle errors
const errorHandler = (err, req, res) => {
  if (!err.statusCode) {
    res.status(500);
  }
  res.send(err.message);
};

module.exports = { errorHandler, accessLogger, errorLogger };
