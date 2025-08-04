CREATE TABLE if not exists `reservations_rooms` (
  `reservationId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  PRIMARY KEY (`reservationId`,`roomId`),
  KEY `rooms_FK` (`roomId`),
  CONSTRAINT `reservations_rooms_resFK` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `rooms_FK` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci