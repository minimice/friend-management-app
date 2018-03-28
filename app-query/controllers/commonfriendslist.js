'use strict';

const logger = require('../utilities/logger');
const router = require('express').Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const db = require('../utilities/db');

// Test cases
// curl -d '{  "friends": [ "andy@example.com", "john@example.com" ]}' -H 'content-type:application/json' -X GET "http://localhost:8000/api/commonfriendslist"
// curl -d '{  "friends": [ "andy@example.com", "john2@example.com" ]}' -H 'content-type:application/json' -X GET "http://localhost:8000/api/commonfriendslist"
// curl -d '{  "friends": [ "andy@example.com", "nonuser@example.com" ]}' -H 'content-type:application/json' -X GET "http://localhost:8000/api/commonfriendslist"

router.get('/', function(req, res) {
    // Set response header
    res.setHeader('Content-Type', 'application/json');

    if (req && req.body && req.body.friends && req.body.friends.length == 2) {
        // Parse the body
        const user1 = req.body.friends[0];
        const user2 = req.body.friends[1];
                
        logger.info("Commonfriendslist API GET email addresses to query: " + user1 + " and " + user2);

        var user1friends = [];
        var user2friends = [];

        // Select friends from the FriendRelationsRead view
        db.executeSql("SELECT user2email FROM FriendRelationsRead WHERE user1email = ?", [user1])
            .then((result) => {
                logger.info(user1 + " has " + result.length + " friends.");
                user1friends = result.map(function(res) {
                    return res["user2email"];
                })
                return db.executeSql("SELECT user2email FROM FriendRelationsRead WHERE user1email = ?", [user2])
            }).then((result) => {
                logger.info(user2 + " has " + result.length + " friends.");
                user2friends = result.map(function(res) {
                    return res["user2email"];
                })
            }).then(() => {
                var commonfriends = user1friends.filter(function(n) {
                    return user2friends.indexOf(n) > -1;
                });
                logger.info("Common friends count is " + commonfriends.length);
                res.send(JSON.stringify({ success: true, friends: commonfriends, count: commonfriends.length }, null, 3));
            })
    } else {
        // Otherwise return an error
        res.send(JSON.stringify({ success: false, message: "JSON request is malformed" }, null, 3));
    }
});

module.exports = router;