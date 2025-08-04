CREATE TABLE if not exists `users_reservations` (
  `userId` int(11) NOT NULL,
  `reservationId` int(11) NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 1,
  `outside` tinyint(1) NOT NULL DEFAULT 0,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`userId`,`reservationId`),
  KEY `users_groups_rFK` (`reservationId`),
  CONSTRAINT `users_groups_rFK` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `users_groups_uFK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci