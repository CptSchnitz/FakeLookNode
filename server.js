const express = require('express');
const winston = require('winston');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const ioFactory = require('socket.io');

module.exports = class Server {
  constructor(routes, middleware, serverConfig, corsOptions, logPaths, swaggerDocument, socketio) {
    this.serverConfig = serverConfig;
    this.socketio = socketio;
    this.app = express();

    const { format, transports } = winston;
    winston.configure({
      transports: [
        new transports.File({ filename: logPaths.log }),
      ],
      format: format.combine(format.timestamp(), format.splat(), format.simple()),
    });

    this.app.use(cors(corsOptions));

    this.app.use(middleware.accessLogger());

    this.app.use(express.json());

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    this.app.use('/', routes);

    this.app.use('*', (req, res, next) => {
      const err = new Error('path not valid');
      err.status = 404;
      next(err);
    });

    this.app.use(middleware.errorLogger());

    this.app.use(middleware.errorHandler);
  }

  start() {
    let server;
    const {
      port, ssl, sslKey, sslCert,
    } = this.serverConfig;
    if (ssl) {
      const privateKey = fs.readFileSync(sslKey);
      const certificate = fs.readFileSync(sslCert);
      const credentials = { key: privateKey, cert: certificate };
      server = https.createServer(credentials, this.app);
    } else {
      server = http.createServer(this.app);
    }
    const io = ioFactory(server);
    server.listen(port);
    this.socketio(io);
  }
};
