INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'správce'),
(3, 'uživatel'),
(4, 'veřejnost');

INSERT INTO `users` (`first_name`, `last_name`, `role`, `password`, `email`, `verified`, `theme`, `children`) 
VALUES ('Test', 'User', 1, MD5('meinestadt'), 'ondrej.hajek.profi@gmail.com', 1, null, 0);