CREATE TABLE if not exists `reservations_rooms_new` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `room` ENUM('Pokoj 1', 'Pokoj 2', 'Pokoj 3', 'Pokoj 4', 'Pokoj 5'),
  PRIMARY KEY (`id`),
  KEY `reservations_rooms_resFK_new` (`reservationId`),
  CONSTRAINT `reservations_rooms_resFK_new` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO reservations_rooms_new (reservationId, room)
SELECT reservationId, 
  CASE 
    WHEN roomId = 1 THEN 'Pokoj 1'
    WHEN roomId = 2 THEN 'Pokoj 2'
    WHEN roomId = 3 THEN 'Pokoj 3'
    WHEN roomId = 4 THEN 'Pokoj 4'
    WHEN roomId = 5 THEN 'Pokoj 5'
  END
FROM reservations_rooms;

DROP TABLE reservations_rooms;
ALTER TABLE reservations_rooms_new RENAME TO reservations_rooms;