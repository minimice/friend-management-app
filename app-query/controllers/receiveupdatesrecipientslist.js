'use strict';

const logger = require('../utilities/logger');
const router = require('express').Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const db = require('../utilities/db');

// Test cases
// curl -d '{  "sender": "andy@example.com", "text": "Hello World! kate@example.com john2@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"
// curl -d '{  "sender": "andy@example.com", "text": "Hello World! bobby@example.com kate@example.com john2@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"
// curl -d '{  "sender": "andy@example.com", "text": "" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"
// curl -d '{  "sender": "andy@example.com", "text": " " }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"
// curl -d '{  "sender": "nonuser@example.com", "text": "Hello World! bobby@example.com john2@example.com" }' -H 'content-type:application/json' -X GET "http://localhost:8000/api/receiveupdatesrecipientslist"

router.get('/', function(req, res) {
    // Set response header
    res.setHeader('Content-Type', 'application/json');

    if (req && req.body && req.body.sender && req.body.text) {
        // Parse the body
        const sender = req.body.sender;
        const text = req.body.text;
                
        logger.info("Receiveupdatesrecipientslist API GET sender is " + sender + " with body text '" + text + "'");

        var senderFriends = [];
        var senderSubscribers = [];
        var blockers = [];

        db.executeSql("SELECT email from User Where email = ?", [sender])
            .then((result) => {
                if (result.length === 0) {
                    return Promise.reject("Not a valid user");
                }
                // Select friends from the FriendRelationsRead view
                return db.executeSql("SELECT user2email FROM FriendRelationsRead WHERE user1email = ?", [sender])
            }).then((result) => {
                logger.info(sender + " has " + result.length + " friends (which are not blocking him/her).");
                senderFriends = result.map(function(res) {
                    return res["user2email"];
                })
                return db.executeSql("SELECT subscriberEmail FROM SubscriberRelationsRead WHERE providerEmail = ?", [sender])
            }).then((result) => {
                logger.info(sender + " has " + result.length + " subscribers (which are not blocking him).");
                senderSubscribers = result.map(function(res) {
                    return res["subscriberEmail"];
                })
                return db.executeSql("SELECT user1email FROM BlockingRelationsRead WHERE user2email = ?", [sender])
            }).then((result) => {
                logger.info(sender + " has " + result.length + " users which are blocking him/her.");
                blockers = result.map(function(res) {
                    return res["user1email"];
                })
            }).then(() => {
                // remove duplicates between friends and subscribers
                senderFriends = senderFriends.filter(function(val) {
                    return senderSubscribers.indexOf(val) == -1;
                });

                var friendsAndSubscribers = senderFriends.concat(senderSubscribers);
                var allReceivers = friendsAndSubscribers;
                
                var extractedEmails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

                if (extractedEmails && extractedEmails.length > 0) {
                    logger.info(extractedEmails.length + " extracted emails.");

                    // remove blocking email addresses from extractedemails
                    extractedEmails = extractedEmails.filter(function(val) {
                        return blockers.indexOf(val) == -1;
                    });

                    // remove duplicates between extractedEmails and friendsAndSubscribers
                    friendsAndSubscribers = friendsAndSubscribers.filter(function(val) {
                        return extractedEmails.indexOf(val) == -1;
                    });

                    allReceivers = friendsAndSubscribers.concat(extractedEmails);
                }

                logger.info("Recipient count is " + allReceivers.length);
                res.send(JSON.stringify({ success: true, recipients: allReceivers }, null, 3));
            }).catch((rejectreason) => {
                logger.info("Not a valid user!");
                res.send(JSON.stringify({ success: false, message: rejectreason }, null, 3));
            })
    } else {
        // Otherwise return an error
        res.send(JSON.stringify({ success: false, message: "JSON request is malformed" }, null, 3));
    }
});

module.exports = router;