CREATE TABLE `hmdb`.`movie` (
  `mov_id` INT NOT NULL AUTO_INCREMENT,
  `mov_title` VARCHAR(100) NOT NULL,
  `mov_rating` INT NULL,
  `mov_mpaa` VARCHAR(5) NULL,
  `mov_duration` INT NOT NULL,
  `mov_release` DATETIME NULL,
  PRIMARY KEY (`mov_id`));
  
CREATE TABLE `actor` (
  `act_id` int NOT NULL AUTO_INCREMENT,
  `act_first_name` varchar(100) DEFAULT NULL,
  `act_last_name` varchar(100) DEFAULT NULL,
  `act_dob` datetime DEFAULT NULL,
  PRIMARY KEY (`act_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `movie` (
  `mov_id` int NOT NULL AUTO_INCREMENT,
  `mov_title` varchar(100) NOT NULL,
  `mov_rating` decimal(3,1) DEFAULT NULL,
  `mov_mpaa` varchar(5) DEFAULT NULL,
  `mov_duration` int NOT NULL,
  `mov_release_year` int DEFAULT NULL,
  PRIMARY KEY (`mov_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

TRUNCATE TABLE movie;
INSERT INTO movie (mov_title, mov_duration) VALUES ('Sinners', 120); 
INSERT INTO movie (mov_title, mov_duration) VALUES ('Wicked, Part 2', 180); 
INSERT INTO movie (mov_title, mov_duration) VALUES ('Die Hard', 145); 
INSERT INTO movie (mov_title, mov_duration) VALUES ('The Rip', 150); 
INSERT INTO movie (mov_title, mov_duration) VALUES ('John Wick', 120); 
INSERT INTO movie (mov_title, mov_duration) VALUES ('Good Will Hunting', 114); 

SELECT *
FROM movie
;

TRUNCATE TABLE actor;
INSERT INTO actor (act_first_name, act_last_name) VALUES ('Michael B.','Jordon');
INSERT INTO actor (act_first_name, act_last_name) VALUES ('Timothy','Chalamet');
INSERT INTO actor (act_first_name, act_last_name) VALUES ('Matt','Damon');
INSERT INTO actor (act_first_name, act_last_name) VALUES ('Ben','Affleck');
INSERT INTO actor (act_first_name, act_last_name) VALUES ('Bruce','Willis');

SELECT *
FROM actor
;

-- Matt Damon was in Good Will Hunting and Iron Man
TRUNCATE TABLE movie_role;
INSERT INTO movie_role(maj_mov_id, maj_act_id, maj_character) VALUES (4, 3, 'LT');
INSERT INTO movie_role(maj_mov_id, maj_act_id, maj_character) VALUEs (6,3, 'Will');

SELECT *
FROM movie_role
;

SELECT mov_title
FROM movie_role
JOIN movie ON mov_id = maj_mov_id
JOIN actor ON maj_act_id = act_id
WHERE act_first_name = 'Matt'
AND act_last_name = 'Damon'
ORDER BY mov_title
;

-- Update data within hMDB schema
SELECT *
FROM movie
WHERE mov_id = 3
;

-- Updates a single record with the WHERE clause
UPDATE movie
SET mov_mpaa = 'R', mov_release = '2025-12-01'
WHERE mov_id = 3
;

-- Updates all records by omiting the WHERE clause (DANGEROUS )
UPDATE movie
SET mov_rating = 10
WHERE mov_id > 0
;

-- Updates all records that are missing a value
UPDATE movie
SET mov_mpaa = NULL
WHERE mov_mpaa = 'N/A'
;

-- Delete Movies
DELETE FROM movie
WHERE mov_id = 1
;

DROP TABLE movie;
CREATE TABLE `hmdb`.`movie` (
  `mov_id` INT NOT NULL AUTO_INCREMENT,
  `mov_title` VARCHAR(100) NOT NULL,
  `mov_genre` VARCHAR(100) NULL,
  `mov_rating` DECIMAL(3,1) NULL,
  `mov_mpaa` VARCHAR(5) NULL,
  `mov_duration` INT NOT NULL,
  `mov_release_year` INT NULL,
  PRIMARY KEY (`mov_id`));
  
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Devil in Ohio',2022,356,5.9);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Blonde',2022,100,6.2);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('End of the Road,(II)', 2022,89,4.7);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Glass Onion: A Knives Out Mystery',2022,139,8.1);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Do Revenge',2022,118,6.4);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('I Came By',2022,110,6.1);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('No Limit',2022,118,5.8);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('The Lord of the Rings: The Fellowship of the Ring',2001,178,8.8);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Echoes',2022,132,5.9);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('The Gray Man',2022,122,6.5);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Me Time',2022,101,5);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Love in the Villa',2022,114,5.3);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Day Shift',2022,113,6.1);
INSERT INTO movie (mov_title, mov_release_year, mov_duration, mov_rating) VALUES ('Guillermo del Toro''s Pinocchio',2022,114,1.0);

select * from movie;