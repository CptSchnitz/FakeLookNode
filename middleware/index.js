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
  skip: (req, res, err) => err.status < 500,
});

// handle errors
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  res.status(err.status || 500).send(err.message);
};

const parseData = (req, res, next) => {
  try {
    req.body = JSON.parse(req.body.data);
    next();
  } catch (error) {
    const err = new Error('Can\'t parse data in JSON');
    err.status = 400;
    next(err);
  }
};

module.exports = {
  errorHandler, accessLogger, errorLogger, parseData,
};
