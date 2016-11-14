const winston = require("winston");

const logger =  new winston.Logger({
    transports: [
        // winston allows you to define a level property on each transport which
        // specifies the maximum level of messages that a transport should log.
        // For example, using the npm levels you could log only error messages to
        // the console and everything info and below to a file
        // (which includes error messages):
        //
        // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
        new (winston.transports.Console)({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new (winston.transports.File)({
            filename: "./node.log",
            level: 'info',
            handleExceptions: true,
            json: true,
            maxFiles: 5,
            colorize: false,
        })
    ],
});

module.exports = logger;
