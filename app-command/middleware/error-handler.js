'use strict';

const logger = require('../utilities/logger');

module.exports = function errorHandler(err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send('Something failed!');
}
