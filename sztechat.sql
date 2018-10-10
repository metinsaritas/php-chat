-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1:3306
-- Üretim Zamanı: 10 Eki 2018, 02:48:09
-- Sunucu sürümü: 5.7.21
-- PHP Sürümü: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `sztechat`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(60) DEFAULT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

--
-- Tablo döküm verisi `user`
--

INSERT INTO `user` (`id`, `nickname`, `email`, `password`, `date`) VALUES
(9, 'a', 'a@gmail.com', '202cb962ac59075b964b07152d234b70', '2018-10-08 21:32:42'),
(8, 'metinsaritas2', 'metinsaritas2@gmail.com', '202cb962ac59075b964b07152d234b70', '2018-10-08 19:51:08'),
(12, 'asd', 'asd@13.com', 'c81e728d9d4c2f636f067f89cc14862c', '2018-10-10 02:36:29'),
(13, 'yeni', 'yeni@y.com', '202cb962ac59075b964b07152d234b70', '2018-10-10 02:41:45');

--
-- Tetikleyiciler `user`
--
DROP TRIGGER IF EXISTS `setNickname`;
DELIMITER $$
CREATE TRIGGER `setNickname` BEFORE INSERT ON `user` FOR EACH ROW SET NEW.nickname = SUBSTRING(NEW.email, 1 , POSITION('@' IN NEW.email) - 1)
$$
DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
