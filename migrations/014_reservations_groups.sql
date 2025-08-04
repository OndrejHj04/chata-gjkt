CREATE TABLE if not exists `reservations_groups` (
  `reservationId` int(11) NOT NULL,
  `groupId` int(11) NOT NULL,
  PRIMARY KEY (`reservationId`,`groupId`),
  KEY `groups_FK` (`groupId`),
  CONSTRAINT `groups_FK` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `reservations_FK` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci