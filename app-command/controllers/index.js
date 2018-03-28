'use strict';

const router = require('express').Router();
const monitoringController = require('./monitoring');
const friendconnectionController = require('./friendconnection');
const blockupdatesController = require('./blockupdates');
const subscribeupdatesController = require('./subscribeupdates');

router.use('/monitoring', monitoringController);
router.use('/friendconnection', friendconnectionController);
router.use('/blockupdates', blockupdatesController);
router.use('/subscribeupdates', subscribeupdatesController);

module.exports = router;
