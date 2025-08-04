CREATE TABLE if not exists `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `allow_mail_sending` tinyint(1) NOT NULL,
  `main_application_email` varchar(255) NOT NULL,
  `registration_document_spreadsheet` varchar(255) NOT NULL,
  `whole_object` int(11) NOT NULL,
  `public_payment` int(11) NOT NULL,
  `employees_payment` int(11) NOT NULL,
  `ZO_payment` int(11) NOT NULL,
  `bank_account_number` varchar(255) NOT NULL,
  `payment_symbol_format` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
