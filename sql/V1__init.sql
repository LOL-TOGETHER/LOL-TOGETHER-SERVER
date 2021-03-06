CREATE TABLE IF NOT EXISTS  comment
(
    `id`                 BIGINT          NOT NULL    AUTO_INCREMENT, 
    `board_id`           BIGINT          NOT NULL, 
    `member_id`          BIGINT          NOT NULL, 
    `content`            VARCHAR(300)    NULL, 
    `created_data_time`  TIMESTAMP       NOT NULL, 
    CONSTRAINT  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS  member
(
    `id`                 BIGINT          NOT NULL    AUTO_INCREMENT, 
    `email`              VARCHAR(100)    NOT NULL, 
    `password`           VARCHAR(255)    NOT NULL, 
    `salt`               VARCHAR(255)    NOT NULL, 
    `name`               VARCHAR(100)    NOT NULL, 
    `created_data_time`  TIMESTAMP       NOT NULL, 
    `champions`          VARCHAR(100)    NULL, 
    CONSTRAINT  PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS  board
(
    `id`                 BIGINT         NOT NULL    AUTO_INCREMENT, 
    `member_id`          BIGINT         NULL,
    `line`               VARCHAR(30)    NULL, 
    `title`              VARCHAR(50)    NULL, 
    `content`            TEXT           NULL, 
    `created_data_time`  DATETIME       NULL, 
    CONSTRAINT  PRIMARY KEY (id)
);


