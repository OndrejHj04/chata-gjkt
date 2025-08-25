CREATE TABLE if not exists `photogallery_albums` (
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `owner` int(11) DEFAULT NULL,
  `visibility` enum('veřejné','soukromé') NOT NULL DEFAULT 'veřejné',
  PRIMARY KEY (`name`),
  KEY `photogallery_albums_owner_FK` (`owner`),
  CONSTRAINT `photogallery_albums_ownerFK` FOREIGN KEY (`owner`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;