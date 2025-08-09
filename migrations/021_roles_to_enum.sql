ALTER TABLE users DROP FOREIGN KEY user_roleFK;
ALTER TABLE users ADD COLUMN role_new ENUM('admin', 'uživatel', 'veřejnost');
UPDATE users SET role_new = CASE 
    WHEN role = 1 THEN 'admin'
    WHEN role = 2 THEN 'admin'
    WHEN role = 3 THEN 'uživatel'
    WHEN role = 4 THEN 'veřejnost'
END;
ALTER TABLE users DROP COLUMN role;
ALTER TABLE users CHANGE role_new role ENUM('admin', 'uživatel', 'veřejnost') NOT NULL;