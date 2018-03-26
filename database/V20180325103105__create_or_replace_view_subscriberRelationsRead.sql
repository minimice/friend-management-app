CREATE OR REPLACE VIEW friendshipdb.SubscriberRelationsRead
AS
SELECT  subscriptionRelationship.subscriber subscriber,
        userEmail.email subscriberEmail,
        subscriptionRelationship.provider provider,
        userEmail2.email providerEmail,
        IfNull(subscriptionRelationship.subscriptionStatus,0) subscribedToUpdates
FROM    friendshipdb.UserUpdatesSubscription subscriptionRelationship
LEFT JOIN friendshipdb.User userEmail
      ON userEmail.Id = subscriptionRelationship.subscriber
LEFT JOIN friendshipdb.User userEmail2
      ON userEmail2.Id = subscriptionRelationship.provider
WHERE NOT EXISTS 
(SELECT * FROM friendshipdb.UserRelationship 
      WHERE user1 = subscriber AND user2 = provider AND status = 3)
--LEFT JOIN friendshipdb.UserUpdatesSubscription userUpdatesSubscription
--      ON userRelationship1.user1 = userUpdatesSubscription.subscriber
 --     AND userRelationship1.user2 = userUpdatesSubscription.provider
--WHERE status = 1 and user2 in (SELECT user1 FROM friendshipdb.UserRelationship WHERE user2 = userRelationship1.user1 and status = 1)


-- SELECT * FROM friendshipdb.UserRelationship WHERE user1 = 1 and status = 1 and user2 in (SELECT user1 FROM friendshipdb.UserRelationship WHERE user2 = 1 and status = 1)

