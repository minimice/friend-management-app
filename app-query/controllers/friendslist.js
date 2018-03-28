'use strict';

const logger = require('../utilities/logger');
const router = require('express').Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const db = require('../utilities/db');

// Test cases
// curl -d '{  "email": "andy@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/friendslist"
// curl -d '{  "email": "john@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/friendslist"
// curl -d '{  "email": "nonuser@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/friendslist"

router.get('/', function(req, res) {
    // Set response header
    res.setHeader('Content-Type', 'application/json');

    if (req && req.body && req.body.email) {
        // Parse the body
        const email = req.body.email;
        logger.info("Friendslist API GET email to query: " + email);

        // Select friends from the FriendRelationsRead view
        db.executeSql("SELECT user2email FROM FriendRelationsRead WHERE user1email = ?", [email])
            .then((result) => {
                logger.info(email + " has " + result.length + " friends.");

                var friendsArr = result.map(function(res) {
                    return res["user2email"];
                })
                res.send(JSON.stringify({ success: true, friends: friendsArr, count: result.length }, null, 3));
            })
    } else {
        // Otherwise return an error
        res.send(JSON.stringify({ success: false, message: "JSON request is malformed" }, null, 3));
    }
});

module.exports = router;