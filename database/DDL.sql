-- DROP DATABASE IF EXISTS cineforum;
-- CREATE DATABASE cineforum;

-- USERS

CREATE TABLE users (
  username VARCHAR (30) PRIMARY KEY,
  biography VARCHAR (280) CHECK (biography <> ''),
  email VARCHAR (320),
  country VARCHAR (60),
  is_public BOOLEAN DEFAULT TRUE,
  date_of_birth DATE CHECK (date_of_birth < CURRENT_DATE),
  avatar BYTEA,
  password VARCHAR (60) CHECK (password <> ''),
  name VARCHAR (60) CHECK (name <> ''),
  last_name VARCHAR (60) CHECK (last_name <> ''),
  deleted BOOLEAN NOT NULL DEFAULT FALSE,
  token VARCHAR (280),
  is_verified BOOLEAN DEFAULT FALSE,
  CONSTRAINT null_entries
    CHECK (deleted OR (
      email IS NOT NULL AND
      is_public IS NOT NULL AND
      date_of_birth IS NOT NULL AND
      avatar IS NOT NULL AND
      password IS NOT NULL AND
      name IS NOT NULL AND
      last_name IS NOT NULL AND
      is_verified IS NOT NULL))
);

CREATE TABLE administrator (
  username VARCHAR (30) PRIMARY KEY,
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE follow_user (
  username_follower VARCHAR (30) NOT NULL,
  username_following VARCHAR (30) NOT NULL,
  PRIMARY KEY (username_follower, username_following),
  FOREIGN KEY (username_follower)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (username_following)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT follow_same_user
    CHECK (username_follower <> username_following)
);

CREATE TABLE report_user (
  username_reporter VARCHAR (30) NOT NULL,
  username_reportee VARCHAR (30) NOT NULL,
  reason VARCHAR (60) NOT NULL CHECK (reason <> ''),
  more_info TEXT CHECK (more_info <> ''),
  PRIMARY KEY (username_reporter, username_reportee),
  FOREIGN KEY (username_reporter)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (username_reportee)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT report_same_user
    CHECK (username_reporter <> username_reportee)
);

-- MESSAGES

CREATE TABLE messages (
  id_message SERIAL PRIMARY KEY,
  username_sender VARCHAR (30) NOT NULL,
  username_receiver VARCHAR (30) NOT NULL,
  id_reply INT,
  content VARCHAR (500) NOT NULL CHECK (content <> ''),
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username_sender)
    REFERENCES users (username)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (username_receiver)
    REFERENCES users (username)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (id_reply)
    REFERENCES messages (id_message)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ENTRIES

CREATE TABLE entry (
  id_entry SERIAL PRIMARY KEY,
  title VARCHAR (60) NOT NULL CHECK (title <> ''),
  synopsis VARCHAR (280) NOT NULL CHECK (synopsis <> ''),
  image TEXT NOT NULL,
  release INT NOT NULL,
  classification VARCHAR (3) NOT NULL CHECK (classification in ('AA', 'A', 'B', 'B15', 'C', 'D', 'NA')),
  type CHAR (1) NOT NULL CHECK (type IN ('m', 's', 'e'))
);

CREATE TABLE last_inserted_entry (
  id_entry INT PRIMARY KEY,
  index INT NOT NULL,
  type CHAR (1) NOT NULL,
  FOREIGN KEY (id_entry)
    REFERENCES entry (id_entry)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE movie (
  id_movie INT PRIMARY KEY,
  trailer TEXT,
  length INT NOT NULL CHECK (length > 0),
  FOREIGN KEY (id_movie)
    REFERENCES entry (id_entry)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE series (
  id_series INT PRIMARY KEY,
  trailer TEXT,
  FOREIGN KEY (id_series)
    REFERENCES entry (id_entry)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE episode (
  id_episode INT PRIMARY KEY,
  id_series INT NOT NULL,
  season INT NOT NULL CHECK (season >= 0),
  no_ep INT NOT NULL CHECK (no_ep >= 0),
  length INT NOT NULL CHECK (length > 0),
  FOREIGN KEY (id_series)
    REFERENCES series (id_series)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_episode)
    REFERENCES entry (id_entry)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- CELEBRITIES

CREATE TABLE celebrity (
  id_celebrity SERIAL PRIMARY KEY,
  name VARCHAR (100) NOT NULL CHECK (name <> ''),
  biography TEXT CHECK (biography <> ''),
  picture TEXT
);

CREATE TABLE follow_celebrity (
  username VARCHAR (30) NOT NULL,
  id_celebrity INT NOT NULL,
  PRIMARY KEY (username, id_celebrity),
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_celebrity)
    REFERENCES celebrity (id_celebrity)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE roles (
  id_celebrity INT NOT NULL,
  id_entry INT NOT NULL,
  role VARCHAR (60) NOT NULL CHECK (role <> ''),
  PRIMARY KEY (id_celebrity, id_entry, role),
  FOREIGN KEY (id_celebrity)
    REFERENCES celebrity (id_celebrity)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_entry)
    REFERENCES entry (id_entry)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- LISTS

CREATE TABLE playlist (
  list_name VARCHAR (60) NOT NULL,
  username VARCHAR (30) NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  date_created DATE NOT NULL DEFAULT CURRENT_DATE,
  date_modified DATE NOT NULL DEFAULT CURRENT_DATE,
  description VARCHAR (280) CHECK (description <> ''),
  PRIMARY KEY (list_name, username),
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT modificacion_valida
    CHECK (date_created <= date_modified)
);

CREATE TABLE playlist_entry (
  id_entry INT NOT NULL,
  list_name VARCHAR (60) NOT NULL,
  username VARCHAR (30) NOT NULL,
  PRIMARY KEY (id_entry, list_name, username),
  FOREIGN KEY (list_name, username)
    REFERENCES playlist (list_name, username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- RATINGS & REPLIES

CREATE TABLE rating (
  id_rating SERIAL PRIMARY KEY,
  id_entry INT NOT NULL,
  username VARCHAR (30) NOT NULL,
  stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  message TEXT CHECK (message <> ''),
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_entry)
    REFERENCES entry (id_entry)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE reply (
  id_reply SERIAL PRIMARY KEY,
  id_rating INT NOT NULL,
  username VARCHAR (30) NOT NULL,
  message TEXT CHECK (message <> ''),
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_rating)
    REFERENCES rating (id_rating)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE likes (
  username VARCHAR (30) NOT NULL,
  id_rating INT NOT NULL,
  is_like BOOLEAN NOT NULL,
  PRIMARY KEY (username, id_rating),
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_rating)
    REFERENCES rating (id_rating)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE report_rating (
  username VARCHAR (30) NOT NULL,
  id_rating INT NOT NULL,
  PRIMARY KEY (username, id_rating),
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_rating)
    REFERENCES rating (id_rating)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE report_reply (
  username VARCHAR (30) NOT NULL,
  id_reply INT NOT NULL,
  PRIMARY KEY (username, id_reply),
  FOREIGN KEY (username)
    REFERENCES users (username)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_reply)
    REFERENCES reply (id_reply)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- GENRES

CREATE TABLE genre (
  name VARCHAR (60) PRIMARY KEY CHECK (name <> '')
);

CREATE TABLE movie_genre (
  name VARCHAR (60) NOT NULL,
  id_entry INT NOT NULL,
  PRIMARY KEY (name, id_entry),
  FOREIGN KEY (name)
    REFERENCES genre (name)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_entry)
    REFERENCES entry (id_entry)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
