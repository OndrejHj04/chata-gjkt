CREATE TABLE if not exists `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `name` varchar(255) NOT NULL,
  `purpouse` varchar(255) NOT NULL,
  `leader` int(11) DEFAULT NULL,
  `instructions` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `success_link` varchar(512) DEFAULT NULL,
  `payment_symbol` varchar(512) DEFAULT NULL,
  `reject_reason` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_statusFK` (`status`),
  KEY `reservation_leaderFK` (`leader`),
  CONSTRAINT `reservation_leaderFK` FOREIGN KEY (`leader`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `reservation_statusFK` FOREIGN KEY (`status`) REFERENCES `status` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci