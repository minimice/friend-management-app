'use strict';

const router = require('express').Router();
const monitoringController = require('./monitoring');
const friendconnectionController = require('./friendconnection'); // TO MOVE
const friendslistController = require('./friendslist');
const commonfriendslistController = require('./commonfriendslist');
const receiveupdatesrecipientsController = require('./receiveupdatesrecipientslist');

router.use('/monitoring', monitoringController);
router.use('/friendconnection', friendconnectionController);
router.use('/friendslist', friendslistController);
router.use('/commonfriendslist', commonfriendslistController);
router.use('/receiveupdatesrecipientslist', receiveupdatesrecipientsController);

module.exports = router;
