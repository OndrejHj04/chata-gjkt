ALTER TABLE users DROP FOREIGN KEY user_organizationFK;
ALTER TABLE users ADD COLUMN organisation_new ENUM('ZO', 'zaměstnanec', 'veřejnost');
UPDATE users SET organisation_new = CASE 
    WHEN organization = 1 THEN 'ZO'
    WHEN organization = 2 THEN 'zaměstnanec'
    WHEN organization = 3 THEN 'veřejnost'
END;
ALTER TABLE users DROP COLUMN organization;
ALTER TABLE users CHANGE organisation_new organization ENUM('ZO', 'zaměstnanec', 'veřejnost');