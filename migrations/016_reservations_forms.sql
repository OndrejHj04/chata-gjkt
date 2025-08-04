CREATE TABLE if not exists `reservations_forms` (
  `form_id` varchar(512) NOT NULL,
  `form_public_url` varchar(512) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`form_id`),
  KEY `reservations_form_reservationFK` (`reservation_id`),
  KEY `reservations_form_userFK` (`user_id`),
  CONSTRAINT `reservations_form_reservationFK` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `reservations_form_userFK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci