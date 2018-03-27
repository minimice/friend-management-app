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

router.post('/', function(req, res) {
    if (req && req.body && req.body.friends && req.body.friends.length == 2) {

        // Parse the body
        const user1 = req.body.friends[0];
        const user2 = req.body.friends[1];
        logger.info("User1email: " + user1);
        logger.info("User2email: " + user2);

        // Set response header
        res.setHeader('Content-Type', 'application/json');

        // Check if they are already connected
        db.executeSql("SELECT * FROM FriendRelationsRead WHERE user1email = ? AND user2email = ?", [user1,user2])
          .then((result,reject) => {
            logger.info("Result of friendship: " + result.length);
            if (result.length == 1) { // already connected!
                res.send(JSON.stringify({ success: true, message: "Already connected as friends." }, null, 3));
            } else {
                reject();
            }
          }).catch(() => {
            // check user1 exists
            db.executeSql("SELECT * FROM User WHERE email = ?", [user1])
              .then((result, reject) => {
                  if (result.length == 0) {
                      reject();
                  }
                  const user1Id = result[0].id;
                  // check user2 exists
                  db.executeSql("SELECT * FROM User WHERE email = ?", [user2])
                    .then((result, reject) => {
                        if (result.length == 0) {
                            reject();
                        }
                        const user2Id = result[0].id;
                        // connect them!
                        db.executeSql('INSERT INTO UserRelationship (user1,user2,status) VALUES ? ON DUPLICATE KEY UPDATE status = 1', [[[user1Id, user2Id, 1]]])
                          .then((result) => {
                            db.executeSql('INSERT INTO UserRelationship (user1,user2,status) VALUES ? ON DUPLICATE KEY UPDATE status = 1', [[[user2Id, user1Id, 1]]])
                              .then((result) => {
                                res.send(JSON.stringify({ success: true }, null, 3));
                              });
                          });
                    }).catch(() => {
                        res.send(JSON.stringify({ success: false, message: user2 + " does not exist!" }, null, 3));
                    });
            }).catch(() => {
                res.send(JSON.stringify({ success: false, message: user1 + " does not exist!" }, null, 3));
            });
          });
        // otherwise return an error
    } else {
        // Otherwise return an error
        res.send(JSON.stringify({ success: false }, null, 3));
    }
});

module.exports = router;