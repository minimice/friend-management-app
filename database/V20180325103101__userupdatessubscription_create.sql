CREATE TABLE friendshipdb.UserUpdatesSubscription (
    subscriber BIGINT(36) NOT NULL,
    provider BIGINT(36) NOT NULL,
    subscriptionStatus INT NOT NULL,
    PRIMARY KEY (subscriber,provider)
);

-- Status values (Only allowed a single value at any time)
-- 0 means not subscribed (user1 not subscribed to user2)
-- 1 means subscribed (user1 subscribed to user2)