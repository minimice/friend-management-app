'use strict';

const responseTime = require('response-time');
const logger = require('../utilities/logger');

function logResponseRequest(req, res, time) {
    logger.info('Received %s request to %s', req.method, req.originalUrl);
    logger.info('Returned %s in %d ms', res.statusCode, time);
}

module.exports = responseTime(logResponseRequest);
