'use strict';

const logger = require('../utilities/logger');
const router = require('express').Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const db = require('../utilities/db');

// Test cases
// curl -d '{  "friends": [ "andy@example.com", "john@example.com" ]}' -H 'content-type:application/json' "http://localhost:8000/api/friendconnection"
// curl -d '{  "friends": [ "andy1@example.com", "john@example.com" ]}' -H 'content-type:application/json' "http://localhost:8000/api/friendconnection"
// curl -d '{  "friends": [ "andy@example.com", "john2@example.com" ]}' -H 'content-type:application/json' "http://localhost:8000/api/friendconnection"
// curl -d '{  "friends": [ "andy@example.com", "nonuser@example.com" ]}' -H 'content-type:application/json' "http://localhost:8000/api/friendconnection"

router.post('/', function(req, res) {
    // Set response header
    res.setHeader('Content-Type', 'application/json');

    if (req && req.body && req.body.friends && req.body.friends.length == 2) {

        // Parse the body
        const user1 = req.body.friends[0];
        const user2 = req.body.friends[1];
        logger.info("User1email: " + user1);
        logger.info("User2email: " + user2);

        logger.info("Friendconnection API POST to connect " + user1 + " and " + user2);

        var user1Id, user2Id;

        // Check if they are already connected
        db.executeSql("SELECT * FROM FriendRelationsRead WHERE user1email = ? AND user2email = ?", [user1,user2])
            .then((result) => {
                logger.info("Result of friendship: " + result.length);
                if (result.length == 1) { // already connected!
                    res.send(JSON.stringify({ success: true, message: "Already connected as friends." }, null, 3));
                    return Promise.resolve("success");
                }
            }).then((result) => {
                // resolve if they are already connected
                if (result && result === "success") {
                    return Promise.resolve("success");
                }
                // check user1 and user2 exists
                return db.executeSql("SELECT * FROM User WHERE email = ?", [user1])
                    .then((result) => {
                        user1Id = result;
                        return db.executeSql("SELECT * FROM User WHERE email = ?", [user2])
                    })
                    .then((result) => {
                        user2Id = result;
                    })
            }).then((result) => {
                // resolve if they are already connected
                if (result && result === "success") {
                    return Promise.resolve("success");
                }

                if (user1Id.length != 1 && user2Id.length != 1) {
                    return Promise.reject();
                }
                // connect user1 and user2 (if they can be found)
                const user1ToConnect = user1Id[0].id;
                const user2ToConnect = user2Id[0].id;
                return db.executeSql('INSERT INTO UserRelationship (user1,user2,status) VALUES ? ON DUPLICATE KEY UPDATE status = 1', [[[user1ToConnect, user2ToConnect, 1]]])
                        .then((result) => {
                            db.executeSql('INSERT INTO UserRelationship (user1,user2,status) VALUES ? ON DUPLICATE KEY UPDATE status = 1', [[[user2ToConnect, user1ToConnect, 1]]])
                                .then((result) => {
                                    logger.info("Connected " + user1ToConnect + " and " + user2ToConnect);
                                    res.send(JSON.stringify({ success: true }, null, 3));
                                });
                        });
            }).catch(() => {
                res.send(JSON.stringify({ success: false, message: "Unable to connect " + user1 + " and " + user2 }, null, 3));
            });
    } else {
        // Otherwise return an error
        res.send(JSON.stringify({ success: false, message: "JSON request is malformed" }, null, 3));
    }
});

module.exports = router;