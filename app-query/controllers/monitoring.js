'use strict';

const router = require('express').Router();

router.get('/ping', function (req, res, next) {
    res.send("PONG!");
});

module.exports = router;
