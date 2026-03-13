CREATE TABLE `member_data` (
  `idmember_data` int NOT NULL AUTO_INCREMENT,
  `mem_name` varchar(45) DEFAULT NULL,
  `mem_status` varchar(45) DEFAULT NULL,
  `mem_meeting_attendance` varchar(45) DEFAULT NULL,
  `mem_meeting_percentage` int DEFAULT NULL,
  `mem_game_attendance` varchar(45) DEFAULT NULL,
  `mem_game_percentage` varchar(45) DEFAULT NULL,
  `mem_comp_attendance` varchar(45) DEFAULT NULL,
  `mem_comp_percentage` varchar(45) DEFAULT NULL,
  `mem_points_scored` varchar(45) DEFAULT NULL,
  `mem_points_percentage` varchar(45) DEFAULT NULL,
  `mem_hours_support` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idmember_data`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `CyberHawks`.`club_details` (
  `idclub_details` INT NOT NULL,
  `comps_attended` VARCHAR(45) NULL,
  `meetings_hosted` VARCHAR(45) NULL,
  `game_nights_hosted` VARCHAR(45) NULL,
  `total_possible_points` VARCHAR(45) NULL,
  `total_tech_support_hours` VARCHAR(45) NULL,
  PRIMARY KEY (`idclub_details`));

ALTER TABLE `CyberHawks`.`club_details` 
CHANGE COLUMN `idclub_details` `idclub_details` INT NOT NULL AUTO_INCREMENT ;


INSERT INTO member_data
(mem_name, mem_status, mem_meeting_attendance, mem_meeting_percentage,
 mem_game_attendance, mem_game_percentage, mem_comp_attendance,
 mem_comp_percentage, mem_points_scored, mem_points_percentage,
 mem_hours_support)
VALUES
('Ethan Morales', 'Active', '18/20', 90,
 '12/15', '80%', '3/4',
 '75%', '145', '92%',
 '24'),

('Liam Carter', 'Active', '15/20', 75,
 '14/15', '93%', '4/4',
 '100%', '172', '98%',
 '30'),

('Noah Bennett', 'Inactive', '6/20', 30,
 '3/15', '20%', '0/4',
 '0%', '25', '15%',
 '5'),

('Mason Reed', 'Active', '20/20', 100,
 '15/15', '100%', '4/4',
 '100%', '190', '100%',
 '40'),

('Lucas Hayes', 'Probation', '10/20', 50,
 '8/15', '53%', '2/4',
 '50%', '88', '60%',
 '12'),

('Aiden Brooks', 'Active', '17/20', 85,
 '13/15', '87%', '3/4',
 '75%', '134', '85%',
 '20'),

('Jackson Cole', 'Inactive', '4/20', 20,
 '2/15', '13%', '0/4',
 '0%', '12', '8%',
 '3'),

('Logan Price', 'Active', '19/20', 95,
 '14/15', '93%', '4/4',
 '100%', '165', '94%',
 '28');
 
 DELETE FROM club_details;
 
 SELECT *
 FROM member_data
 ;
 
 SHOW TABLES FROM CyberHawks;