/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const config = require('config');
const winston = require('winston');
const expressWinston = require('express-winston');

module.exports = class Middleware {
  constructor(logPaths) {
    this.logPaths = logPaths;
  }

  accessLogger() {
    return expressWinston.logger({
      transports: [new winston.transports.File({ filename: this.logPaths.access })],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    });
  }

  errorLogger() {
    return expressWinston.errorLogger({
      transports: [new winston.transports.File({ filename: this.logPaths.error })],
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp(),
      ),
      skip: (req, res, err) => err.status < 500,
    });
  }

  // handle errors
  errorHandler(err, req, res, _next) {
    res.status(err.status || 500).send(err.message);
  }

  parseData(req, res, next) {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (error) {
      const err = new Error('Can\'t parse data in JSON');
      err.status = 400;
      next(err);
    }
  }
};
