-- Drop the foreign key (correct case)
ALTER TABLE reservations_rooms DROP FOREIGN KEY rooms_FK;

-- Drop the primary key first
ALTER TABLE reservations_rooms DROP PRIMARY KEY;

-- Add the new column
ALTER TABLE reservations_rooms ADD COLUMN roomId_new ENUM('Pokoj 1', 'Pokoj 2', 'Pokoj 3', 'Pokoj 4', 'Pokoj 5');

-- Update with NULL handling
UPDATE reservations_rooms SET roomId_new = CASE 
    WHEN roomId = 1 THEN 'Pokoj 1'
    WHEN roomId = 2 THEN 'Pokoj 2'
    WHEN roomId = 3 THEN 'Pokoj 3'
    WHEN roomId = 4 THEN 'Pokoj 4'
    WHEN roomId = 5 THEN 'Pokoj 5'
    ELSE NULL  -- Handle unexpected values
END;

-- Drop old column and rename new one
ALTER TABLE reservations_rooms DROP COLUMN roomId;
ALTER TABLE reservations_rooms CHANGE roomId_new roomId ENUM('Pokoj 1', 'Pokoj 2', 'Pokoj 3', 'Pokoj 4', 'Pokoj 5') NOT NULL;

-- Recreate the primary key
ALTER TABLE reservations_rooms ADD PRIMARY KEY (reservationId, roomId);