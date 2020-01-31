const express = require("express");
const config = require("config");
const winston = require("winston");
const middlewares = require("./middlewares");
const cors = require("cors");
const router = require("./routes");
const port = config.get("server.app.port");
const app = express();

const logPaths = config.get("server.log.paths");

winston.configure({
    transports: [new winston.transports.File({ filename: logPaths.log })]
});

app.use(cors(config.get("server.corsOptions")));

app.use(middlewares.accessLogger);

app.use("/", router);

app.use("*", function(req, res, next) {
    let err = new Error("Page Not Found");
    err.statusCode = 404;
    next(err);
});

app.use(middlewares.errorLogger);

app.use(middlewares.errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}.`));
