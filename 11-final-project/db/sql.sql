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


INSERT INTO `assignment_planner`.`planned_items`
(title, description, item_type, due_date, start_time, end_time, priority)
VALUES
-- January
('Math Homework 1', 'Chapter 5 problems', 'assignment', '2026-01-03 00:00:00', NULL, NULL, 2),
('Band Practice', 'After school rehearsal', 'event', '2026-01-03 15:00:00', '2026-01-03 15:00:00', '2026-01-03 17:00:00', 1),

('Physics Lab', 'Finish lab report draft', 'assignment', '2026-01-05 00:00:00', NULL, NULL, 3),

('CS Project Work', 'Work on calendar planner', 'assignment', '2026-01-08 00:00:00', NULL, NULL, 2),
('Track Practice', 'Conditioning', 'event', '2026-01-08 16:00:00', '2026-01-08 16:00:00', '2026-01-08 18:00:00', 1),

('English Essay', 'Final draft due', 'assignment', '2026-01-10 00:00:00', NULL, NULL, 3),

('Group Meeting', 'CS group check-in', 'event', '2026-01-12 14:00:00', '2026-01-12 14:00:00', '2026-01-12 15:00:00', 2),

('Math Test', 'Unit test', 'assignment', '2026-01-15 00:00:00', NULL, NULL, 3),

('Work Shift', 'Grocery store shift', 'event', '2026-01-18 12:00:00', '2026-01-18 12:00:00', '2026-01-18 18:00:00', 1),

('History Reading', 'Read chapter 8', 'assignment', '2026-01-20 00:00:00', NULL, NULL, 1),

('Doctor Appointment', 'Annual checkup', 'event', '2026-01-22 10:00:00', '2026-01-22 10:00:00', '2026-01-22 11:00:00', 2),

('Physics Homework', 'Problem set 6', 'assignment', '2026-01-25 00:00:00', NULL, NULL, 2),

('Band Concert', 'Winter performance', 'event', '2026-01-28 19:00:00', '2026-01-28 19:00:00', '2026-01-28 21:00:00', 3),

-- February
('Calc Homework', 'Derivatives worksheet', 'assignment', '2026-02-02 00:00:00', NULL, NULL, 2),

('Track Meet', 'Away meet', 'event', '2026-02-04 15:00:00', '2026-02-04 15:00:00', '2026-02-04 18:00:00', 3),

('CS Project Milestone', 'Submit milestone 1', 'assignment', '2026-02-06 00:00:00', NULL, NULL, 3),

('Dentist Appointment', 'Cleaning', 'event', '2026-02-09 09:00:00', '2026-02-09 09:00:00', '2026-02-09 10:00:00', 1),

('English Reading', 'Finish novel chapters', 'assignment', '2026-02-11 00:00:00', NULL, NULL, 1),

('Band Practice', 'Sectional rehearsal', 'event', '2026-02-14 16:00:00', '2026-02-14 16:00:00', '2026-02-14 18:00:00', 2),

('Physics Test', 'Kinematics exam', 'assignment', '2026-02-17 00:00:00', NULL, NULL, 3),

('Work Shift', 'Weekend shift', 'event', '2026-02-20 13:00:00', '2026-02-20 13:00:00', '2026-02-20 19:00:00', 1),

('Math Quiz', 'Quick quiz', 'assignment', '2026-02-23 00:00:00', NULL, NULL, 2),

('Family Dinner', 'Birthday celebration', 'event', '2026-02-25 18:00:00', '2026-02-25 18:00:00', '2026-02-25 20:00:00', 1),

('CS Debug Session', 'Fix backend bugs', 'assignment', '2026-02-27 00:00:00', NULL, NULL, 2);