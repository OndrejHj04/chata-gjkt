CREATE TABLE if not exists `events_children` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `primary_txt` varchar(255) NOT NULL,
  `secondary_txt` varchar(255) NOT NULL,
  `template` int(11) NOT NULL,
  `event` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `variables` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `templateFK` (`template`),
  KEY `eventFK` (`event`),
  CONSTRAINT `eventFK` FOREIGN KEY (`event`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `templateFK` FOREIGN KEY (`template`) REFERENCES `templates` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci