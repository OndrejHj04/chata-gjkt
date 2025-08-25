CREATE TABLE if not exists `photogallery_albums_photos` (
  `id` varchar(512) NOT NULL,
  `album` varchar(255) NOT NULL,
  `url` varchar(1024) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `albumFK` (`album`),
  CONSTRAINT `albumFK` FOREIGN KEY (`album`) REFERENCES `photogallery_albums` (`name`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
