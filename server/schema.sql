DROP DATABASE reviews_db;
CREATE DATABASE reviews_db;

USE reviews_db;

CREATE TABLE products (
  id INT UNSIGNED NOT NULL PRIMARY KEY,
  name VARCHAR(100),
  slogan VARCHAR(255),
  description VARCHAR(500),
  category VARCHAR(50),
  default_price INT
);

CREATE TABLE reviews (
    id INT UNSIGNED NOT NULL PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    rating INT,
    date BIGINT,
    summary VARCHAR(255),
    body VARCHAR(500),
    recommend VARCHAR(10),
    reported VARCHAR(10) DEFAULT "false",
    reviewer_name VARCHAR(100),
    reviewer_email VARCHAR(100),
    response VARCHAR(255) DEFAULT NULL,
    helpfulness INT DEFAULT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE characteristics (
    id INT UNSIGNED NOT NULL PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    name VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE characteristic_reviews (
    id INT UNSIGNED NOT NULL PRIMARY KEY,
    characteristic_id INT UNSIGNED NOT NULL,
    review_id INT UNSIGNED NOT NULL,
    value INT,
    FOREIGN KEY (characteristic_id) REFERENCES characteristics(id),
    FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE TABLE reviews_photos (
    id INT UNSIGNED NOT NULL PRIMARY KEY,
    review_id INT UNSIGNED NOT NULL,
    url VARCHAR(255),
    FOREIGN KEY (review_id) REFERENCES reviews(id)
);

LOAD DATA INFILE '/var/lib/mysql-files/product.csv'
INTO TABLE products
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA INFILE '/var/lib/mysql-files/characteristics.csv'
INTO TABLE characteristics
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA INFILE '/var/lib/mysql-files/reviews.csv'
INTO TABLE reviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA INFILE '/var/lib/mysql-files/characteristic_reviews.csv'
INTO TABLE characteristic_reviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA INFILE '/var/lib/mysql-files/reviews_photos.csv'
INTO TABLE reviews_photos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;