DROP DATABASE reviews_db;
CREATE DATABASE reviews_db;

USE reviews_db;

CREATE TABLE products (
  id INT UNSIGNED NOT NULL PRIMARY KEY,
  name VARCHAR(100),
  slogan VARCHAR(255),
  description VARCHAR(255),
  category VARCHAR(50),
  default_price INT
);

CREATE TABLE reviews (
    id INT UNSIGNED NOT NULL PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    rating INT,
    date TIMESTAMP,
    summary VARCHAR(255),
    body TEXT,
    recommend VARCHAR(10),
    reported VARCHAR(10),
    reviewer_name VARCHAR(100),
    reviewer_email VARCHAR(100),
    response TEXT DEFAULT NULL,
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

LOAD DATA LOCAL INFILE '/mnt/c/Users/redre/Downloads/product.csv'
INTO TABLE products
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/mnt/c/Users/redre/Downloads/characteristics.csv'
INTO TABLE characteristics
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/mnt/c/Users/redre/Downloads/reviews.csv'
INTO TABLE reviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, product_id, rating, @date_raw, summary, body,
 @recommend_raw, reviewer_name, reviewer_email, @response_raw,
 @helpfulness, @reported_raw)
SET
  helpfulness = NULLIF(@helpfulness,'null'),
  date = FROM_UNIXTIME(LEAST(@date_raw, 2147483647)),
  response = NULLIF(@response_raw,''),
  recommend = CASE WHEN LOWER(TRIM(@recommend_raw)) IN ('true') THEN 1 ELSE 0 END,
  reported = CASE WHEN LOWER(TRIM(@reported_raw))  IN ('true') THEN 1 ELSE 0 END;

LOAD DATA LOCAL INFILE '/mnt/c/Users/redre/Downloads/characteristic_reviews.csv'
INTO TABLE characteristic_reviews
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE '/mnt/c/Users/redre/Downloads/reviews_photos.csv'
INTO TABLE reviews_photos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;