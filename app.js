const express = require("express");
const config = require("config");
const winston = require("winston");
const expressWinston = require("express-winston");
const app = express();
const cors = require("cors");
const router = require("./routes");
const port = config.get("server.app.port");

const logPaths = config.get("server.log.paths");

winston.configure({
    transports:[
        new winston.transports.File({filename: logPaths.log})
    ]
})

app.use(cors());

// access log
app.use(
    expressWinston.logger({
        transports: [
            new winston.transports.File({ filename: logPaths.access })
        ],
        format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp()
        )
    })
);

app.use("/", router);


// catch all routes
app.get('*', function(req,res,next){
    let err = new Error('Page Not Found');
    err.statusCode = 404;
    next(err)
})


// error log
app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.File({ filename: logPaths.error })],
        format: winston.format.combine(
            winston.format.prettyPrint(),
            winston.format.timestamp()
        )
    })
);

// handle errors
app.use(function(err, req, res, next) {
    if (!err.statusCode){
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
});

app.listen(port, () => console.log(`Listening on port ${port}.`));
