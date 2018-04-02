CREATE TABLE friendshipdb.UserRelationship (
    user1 BIGINT(36) NOT NULL,
    user2 BIGINT(36) NOT NULL,
    status INT NOT NULL,
    PRIMARY KEY (user1,user2)
);

-- Status types, can only have a single value at any time
-- 0 means sent-friend-request (user1 is adding a friend connection to user2)
-- 1 means friends-with (user1 is friends with user2)
-- 2 means recieved-friend-request-from (user1 received a friend request from user2)
-- 3 means blocked (user1 blocked user2)
-- 4 means unblocked (user1 unblocked user2)
-- 5 means unfriended (user1 unfriended user2)

-- User1 and user2 are only "friends" when the status is 1 in both directions
-- I am treating this as a directed graph, that is A -> B and B <- A.
-- Both vertices ("status") must have a value of 1 in order for the friendship to be valid.
-- If both status values are 1, then this friendship will automatically be shown in the FriendRelationsRead view
-- That means if User1 blocks User2 or vice versa (i.e. status has a value of 3), this friendship is no longer valid.