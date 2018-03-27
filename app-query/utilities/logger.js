'use strict';

const winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: process.env.LOGLEVEL || 'debug',
            colorize: true,
            timestamp: function () {
                return new Date();
            }
        })
    ]
});

module.exports = logger;
