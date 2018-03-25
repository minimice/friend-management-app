CREATE TABLE friendshipdb.UserUpdatesSubscription (
    user1 BIGINT(36) NOT NULL,
    user2 BIGINT(36) NOT NULL,
    status INT NOT NULL,
    PRIMARY KEY (user1,user2)
);

-- Status values (Only allowed a single value at any time)
-- 0 means not subscribed (user1 not subscribed to user2)
-- 1 means subscribed (user1 subscribed to user2)