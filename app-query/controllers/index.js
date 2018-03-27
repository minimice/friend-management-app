'use strict';

const router = require('express').Router();
const monitoringController = require('./monitoring');

router.use('/monitoring', monitoringController);

module.exports = router;
