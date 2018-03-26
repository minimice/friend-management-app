CREATE TABLE friendshipdb.UserRelationship (
    user1 BIGINT(36) NOT NULL,
    user2 BIGINT(36) NOT NULL,
    status INT NOT NULL,
    PRIMARY KEY (user1,user2)
);

-- Status types, can only have a single value at any time
-- 0 means sent-friend-request (user1 is adding a friend connection to user2)
-- 1 means friends-with (user1 is friends with user2)
-- 3 means blocked (user1 blocked user2)
-- 4 means unblocked (user1 unblocked user2)
-- 5 means unfriended (user1 unfriended user2)