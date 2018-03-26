CREATE OR REPLACE VIEW friendshipdb.BlockingRelationsRead
AS
SELECT  userRelationship1.user1 user1,
        userEmail.email user1email,
        userRelationship1.user2 user2,
        userEmail2.email user2email
        -- userRelationship1.status isblocking
FROM    friendshipdb.UserRelationship userRelationship1
INNER JOIN friendshipdb.User userEmail
      ON userEmail.Id = userRelationship1.user1
INNER JOIN friendshipdb.User userEmail2
      ON userEmail2.Id = userRelationship1.user2
WHERE status = 3

