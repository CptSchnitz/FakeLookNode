const express = require('express');
const config = require('config');
const winston = require('winston');
const cors = require('cors');
const middlewares = require('./middleware');
const router = require('./routes');

const port = config.get('server.app.port');
const app = express();

const logPaths = config.get('server.log.paths');

const { format, transports } = winston;
winston.configure({
  transports: [
    new transports.File({ filename: logPaths.log }),
  ],
  format: format.combine(format.timestamp(), format.splat(), format.simple()),
});

app.use(cors(config.get('server.corsOptions')));

app.use(middlewares.accessLogger);

app.use(express.json());

app.use('/', router);

app.use('*', (req, res, next) => {
  const err = new Error('path not valid');
  res.statusCode = 404;
  next(err);
});

app.use(middlewares.errorLogger);

app.use(middlewares.errorHandler);

app.listen(port, () => winston.log('info', `Listening on port ${port}.`));
