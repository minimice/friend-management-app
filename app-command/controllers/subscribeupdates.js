'use strict';

const logger = require('../utilities/logger');
const router = require('express').Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const db = require('../utilities/db');

// Test cases
// curl -d '{  "requestor": "andy@example.com",  "target": "common@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/subscribeupdates"
// curl -d '{  "requestor": "andy@example.com",  "target": "bobby@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/subscribeupdates"
// curl -d '{  "requestor": "andy@example.com",  "target": "nonuser@example.com" }' -H 'content-type:application/json' "http://localhost:8001/api/subscribeupdates"

router.post('/', function(req, res) {
    // Set response header
    res.setHeader('Content-Type', 'application/json');

    if (req && req.body && req.body.requestor && req.body.target) {

        // Parse the body
        const user1 = req.body.requestor;
        const user2 = req.body.target;
        logger.info("User1email: " + user1);
        logger.info("User2email: " + user2);

        logger.info("Subscribeupdates API POST to subscribe " + user1 + " to " + user2 + "'s feed");

        var user1Id, user2Id;

        // Find out the ids of both users
        db.executeSql("SELECT id FROM User WHERE email = ?", [user1])
            .then((result) => {
                user1Id = result;
                return db.executeSql("SELECT id FROM User WHERE email = ?", [user2])
            }).then((result) => {
                user2Id = result;
                return Promise.resolve();
            }).then((result) => {
                if (user1Id.length != 1 && user2Id.length != 1) {
                    return Promise.reject();
                }
                // Apply subscription of user1 to user2
                const subscriber = user1Id[0].id;
                const producer = user2Id[0].id;
                
                return db.executeSql('INSERT INTO UserUpdatesSubscription (subscriber,provider,subscriptionStatus) VALUES ? ON DUPLICATE KEY UPDATE subscriptionStatus = 1', [[[subscriber, producer, 1]]])
                            .then((result) => {
                                logger.info("Userid " + subscriber + " has subscribed to userid " + producer);
                                res.send(JSON.stringify({ success: true }, null, 3));
                            });
            }).catch(() => {
                res.send(JSON.stringify({ success: false, message: "Unable to subscribe " + user1 + " to " + user2 + "'s feed, one or both users cannot be found in the system." }, null, 3));
            });
    } else {
        // Otherwise return an error
        res.send(JSON.stringify({ success: false, message: "JSON request is malformed" }, null, 3));
    }
});

module.exports = router;