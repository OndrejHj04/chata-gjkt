CREATE TABLE if not exists `user_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NULL,
  `newsId` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `read` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `users_newsFK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `news_userFK` FOREIGN KEY (`newsId`) REFERENCES `news` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci