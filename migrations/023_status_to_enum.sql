ALTER TABLE reservations DROP FOREIGN KEY reservation_statusFK;
ALTER TABLE reservations ADD COLUMN status_new ENUM('archiv', 'čeká na potvrzení', 'potvrzeno', 'zamítnuto', 'blokováno správcem');
UPDATE reservations SET status_new = CASE 
    WHEN status = 1 THEN 'archiv'
    WHEN status = 2 THEN 'čeká na potvrzení'
    WHEN status = 3 THEN 'potvrzeno'
    WHEN status = 4 THEN 'zamítnuto'
    WHEN status = 5 THEN 'blokováno správcem'
END;
ALTER TABLE reservations DROP COLUMN status;
ALTER TABLE reservations CHANGE status_new status ENUM('archiv', 'čeká na potvrzení', 'potvrzeno', 'zamítnuto', 'blokováno správcem') NOT NULL