#CREATE TABLE IF NOT EXISTS consultorio.specialties (
#  id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
#  title varchar(45) NOT NULL,
#  KEY title_idx (title)
#) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS consultorio.physicians (
  id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fname varchar(100) NOT NULL,
  lname varchar(100) NOT NULL,
  gender enum('M','F','X') NOT NULL,
  birth datetime NOT NULL,
  registration varchar(10) NOT NULL,
  UNIQUE KEY registration_UNIQUE (registration),
  specialty varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS consultorio.patients (
  id int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_document varchar(8) NOT NULL,
  UNIQUE KEY id_document_UNIQUE (id_document),
  fname varchar(100) NOT NULL,
  lname varchar(100) NOT NULL,
  gender enum('M','F','X') NOT NULL,
  patient_desc varchar(255) NOT NULL,
  birth datetime NOT NULL,
  area enum('BAR','PLC','LEC') NOT NULL,
  phone varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS consultorio.consultations (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  consultation_date timestamp NOT NULL,
  consultation_desc varchar(255) NOT NULL,
  diagnosis varchar(255) DEFAULT NULL,
  observations varchar(255) DEFAULT NULL,
  register_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  patient_id int unsigned NOT NULL,
  physician_id int unsigned NOT NULL,
  
  FOREIGN KEY (physician_id) REFERENCES consultorio.physicians (id),
  FOREIGN KEY (patient_id) REFERENCES consultorio.patients (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;