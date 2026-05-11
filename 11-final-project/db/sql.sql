CREATE SCHEMA `assignment_planner` ;

CREATE TABLE `assignment_planner`.`planned_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NULL,
  `description` VARCHAR(300) NULL,
  `item_type` VARCHAR(45) NULL,
  `due_date` VARCHAR(45) NULL,
  `start_time` VARCHAR(45) NULL,
  `end_time` VARCHAR(45) NULL,
  `priority` INT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `assignment_planner`.`planned_items` 
CHANGE COLUMN `due_date` `due_date` DATETIME NULL DEFAULT NULL ,
CHANGE COLUMN `start_time` `start_time` DATETIME NULL DEFAULT NULL ,
CHANGE COLUMN `end_time` `end_time` DATETIME NULL DEFAULT NULL ;

ALTER TABLE `assignment_planner`.`planned_items` 
CHANGE COLUMN `priority` `priority` VARCHAR(45) NULL DEFAULT NULL ;

ALTER TABLE `assignment_planner`.`planned_items` 
ADD COLUMN `completed` VARCHAR(45) NULL AFTER `priority`;