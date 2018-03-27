'use strict';

const router = require('express').Router();
const monitoringController = require('./monitoring');
const friendconnectionController = require('./friendconnection');

router.use('/monitoring', monitoringController);
router.use('/friendconnection', friendconnectionController);

module.exports = router;
