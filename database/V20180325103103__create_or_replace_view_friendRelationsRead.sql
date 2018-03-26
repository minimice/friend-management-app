CREATE OR REPLACE VIEW friendshipdb.FriendRelationsRead
AS
SELECT  userRelationship1.user1 user1,
        userEmail.email user1email,
        userRelationship1.user2 user2,
        userEmail2.email user2email
        -- IfNull(userUpdatesSubscription.subscriptionStatus,0) subscribedToUpdates
        -- userRelationship1.status isfriend
FROM    friendshipdb.UserRelationship userRelationship1
INNER JOIN friendshipdb.User userEmail
      ON userEmail.Id = userRelationship1.user1
INNER JOIN friendshipdb.User userEmail2
      ON userEmail2.Id = userRelationship1.user2
-- LEFT JOIN friendshipdb.UserUpdatesSubscription userUpdatesSubscription
--      ON userRelationship1.user1 = userUpdatesSubscription.subscriber
--      AND userRelationship1.user2 = userUpdatesSubscription.provider
WHERE status = 1 and user2 in (SELECT user1 FROM friendshipdb.UserRelationship WHERE user2 = userRelationship1.user1 and status = 1)


-- SELECT * FROM friendshipdb.UserRelationship WHERE user1 = 1 and status = 1 and user2 in (SELECT user1 FROM friendshipdb.UserRelationship WHERE user2 = 1 and status = 1)

