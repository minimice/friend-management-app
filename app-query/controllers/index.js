'use strict';

const router = require('express').Router();
const monitoringController = require('./monitoring');
const friendslistController = require('./friendslist');
const commonfriendslistController = require('./commonfriendslist');
const receiveupdatesrecipientsController = require('./receiveupdatesrecipientslist');

router.use('/monitoring', monitoringController);
router.use('/friendslist', friendslistController);
router.use('/commonfriendslist', commonfriendslistController);
router.use('/receiveupdatesrecipientslist', receiveupdatesrecipientsController);

module.exports = router;
