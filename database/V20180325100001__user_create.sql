CREATE TABLE friendshipdb.User (
    id BIGINT(36) NOT NULL AUTO_INCREMENT,
    email VARCHAR(254), -- 254 char length is RFC 2821 restriction
    PRIMARY KEY (id)
);
