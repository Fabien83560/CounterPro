CREATE TABLE version (
    version_number VARCHAR(10) PRIMARY KEY,
    inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logs (
  id int NOT NULL AUTO_INCREMENT,
  log_date datetime DEFAULT CURRENT_TIMESTAMP,
  type enum('INFO','WARN','ERROR') NOT NULL,
  message varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `users` (
  `user_id` varchar(100) NOT NULL PRIMARY KEY,
  `user_name` varchar(100) NOT NULL,
  `hex` varchar(7) NOT NULL,
  `total_count` bigint DEFAULT 0
);

CREATE TABLE `discord_servers` (
  `server_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `server_name` varchar(100) NOT NULL,
  `channel_counter_id` varchar(100) NOT NULL,
  `channel_information_id` varchar(100) DEFAULT NULL,
  `channel_leaderboards_id` varchar(100) DEFAULT NULL,
  `counter_value` bigint DEFAULT '0',
  `last_user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`server_id`),
  KEY `discord_servers_ibfk_1` (`last_user_id`),
  CONSTRAINT `discord_servers_ibfk_1` FOREIGN KEY (`last_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_server_counters` (
  `user_id` varchar(100) NOT NULL,
  `server_id` varchar(100) NOT NULL,
  `counter_value` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`, `server_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `fk_server_id` FOREIGN KEY (`server_id`) REFERENCES `discord_servers` (`server_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
