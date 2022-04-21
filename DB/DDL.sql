-- DROP DATABASE IF EXISTS cineforum;
-- CREATE DATABASE cineforum;

-- USUARIOS

CREATE TABLE usuario (
  alias VARCHAR (30) PRIMARY KEY,
  biografia VARCHAR (280) CHECK (biografia <> ''),
  correo VARCHAR (280) NOT NULL,
  residencia VARCHAR (60),
  publico BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_nacimiento DATE NOT NULL CHECK (fecha_nacimiento < CURRENT_DATE),
  foto_perfil BYTEA NOT NULL,
  contrasenia VARCHAR (60) NOT NULL CHECK (contrasenia <> ''),
  nombre VARCHAR (60) NOT NULL CHECK (nombre <> ''),
  paterno VARCHAR (60) NOT NULL CHECK (paterno <> ''),
  materno VARCHAR (60) NOT NULL CHECK (materno <> ''),
  eliminado BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE administrador (
  alias VARCHAR (30) PRIMARY KEY,
  FOREIGN KEY (alias)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE seguir_usuario (
  alias_seguidor VARCHAR (30) NOT NULL,
  alias_seguido VARCHAR (30) NOT NULL,
  PRIMARY KEY (alias_seguidor, alias_seguido),
  FOREIGN KEY (alias_seguidor)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (alias_seguido)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT seguir_mismo_usuario
    CHECK (alias_seguidor <> alias_seguido)
);

CREATE TABLE reportar_usuario (
  alias_reporta VARCHAR (30) NOT NULL,
  alias_reportado VARCHAR (30) NOT NULL,
  motivo VARCHAR (60) NOT NULL CHECK (motivo <> ''),
  comentario TEXT CHECK (comentario <> ''),
  PRIMARY KEY (alias_reporta, alias_reportado),
  FOREIGN KEY (alias_reporta)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (alias_reportado)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT reporta_mismo_usuario
    CHECK (alias_reporta <> alias_reportado)
);

-- MENSAJES

CREATE TABLE mensaje (
  id_mensaje SERIAL PRIMARY KEY,
  alias_usuario_rem VARCHAR (30) NOT NULL,
  alias_usuario_dest VARCHAR (30) NOT NULL,
  id_mensaje_respuesta INT,
  contenido VARCHAR (500) NOT NULL CHECK (contenido <> ''),
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alias_usuario_rem)
    REFERENCES usuario (alias)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (alias_usuario_dest)
    REFERENCES usuario (alias)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (id_mensaje_respuesta)
    REFERENCES mensaje (id_mensaje)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ENTRADAS

CREATE TABLE entrada (
  id_entrada SERIAL PRIMARY KEY,
  enlace VARCHAR (60) NOT NULL CHECK (enlace <> ''),
  imagen BYTEA NOT NULL,
  sinopsis VARCHAR (280) NOT NULL CHECK (sinopsis <> ''),
  titulo VARCHAR (60) NOT NULL CHECK (titulo <> ''),
  estreno DATE NOT NULL,
  clasificacion VARCHAR (3) NOT NULL CHECK (clasificacion in ('AA', 'A', 'B', 'B15', 'C', 'D')),
  tipo CHAR (1) NOT NULL CHECK (tipo IN ('p', 's', 'c'))
);

CREATE TABLE pelicula (
  id_pelicula INT PRIMARY KEY,
  duracion INT NOT NULL CHECK (duracion > 0),
  FOREIGN KEY (id_pelicula)
    REFERENCES entrada (id_entrada)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE serie (
  id_serie INT PRIMARY KEY,
  emision BOOLEAN NOT NULL,
  FOREIGN KEY (id_serie)
    REFERENCES entrada (id_entrada)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE capitulo (
  id_capitulo INT PRIMARY KEY,
  id_serie INT NOT NULL,
  temporada INT NOT NULL CHECK (temporada >= 0),
  no_cap INT NOT NULL CHECK (no_cap >= 0),
  duracion INT NOT NULL CHECK (duracion > 0),
  FOREIGN KEY (id_serie)
    REFERENCES serie (id_serie)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_capitulo)
    REFERENCES entrada (id_entrada)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- CELEBRIDADES

CREATE TABLE celebridad (
  id_celebridad SERIAL PRIMARY KEY,
  nombre VARCHAR (100) NOT NULL CHECK (nombre <> ''),
  biografia TEXT CHECK (biografia <> ''),
  foto BYTEA
);

CREATE TABLE seguir_celebridad (
  alias VARCHAR (30) NOT NULL,
  id_celebridad INT NOT NULL,
  PRIMARY KEY (alias, id_celebridad),
  FOREIGN KEY (alias)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_celebridad)
    REFERENCES celebridad (id_celebridad)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE trabajar (
  id_celebridad INT NOT NULL,
  id_entrada INT NOT NULL,
  PRIMARY KEY (id_celebridad, id_entrada),
  FOREIGN KEY (id_celebridad)
    REFERENCES celebridad (id_celebridad)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_entrada)
    REFERENCES entrada (id_entrada)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE rol (
  id_celebridad INT NOT NULL,
  id_entrada INT NOT NULL,
  rol VARCHAR (60) NOT NULL CHECK (rol <> ''),
  PRIMARY KEY (id_celebridad, id_entrada, rol),
  FOREIGN KEY (id_celebridad, id_entrada)
    REFERENCES trabajar (id_celebridad, id_entrada)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- LISTAS DE REPRODUCCION

CREATE TABLE lista_reproduccion (
  nombre VARCHAR (60) NOT NULL,
  alias VARCHAR (30) NOT NULL,
  publica BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_ultima_mod DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion VARCHAR (280) CHECK (descripcion <> ''),
  PRIMARY KEY (nombre, alias),
  FOREIGN KEY (alias)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT modificacion_valida
    CHECK (fecha_creacion <= fecha_ultima_mod)
);

CREATE TABLE contener (
  id_entrada INT NOT NULL,
  nombre_lista_rep VARCHAR (60) NOT NULL,
  alias VARCHAR (30) NOT NULL,
  PRIMARY KEY (id_entrada, nombre_lista_rep, alias),
  FOREIGN KEY (nombre_lista_rep, alias)
    REFERENCES lista_reproduccion (nombre, alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (alias)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- VALORACIONES Y RESPUESTAS

CREATE TABLE valoracion (
  id_valoracion SERIAL PRIMARY KEY,
  id_entrada INT NOT NULL,
  calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  FOREIGN KEY (id_entrada)
    REFERENCES entrada (id_entrada)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE respuesta (
  id_respuesta SERIAL PRIMARY KEY,
  id_valoracion INT NOT NULL,
  alias VARCHAR (30) NOT NULL,
  mensaje VARCHAR (280) CHECK (mensaje <> ''),
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alias)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_valoracion)
    REFERENCES valoracion (id_valoracion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE evaluar (
  alias VARCHAR (30) NOT NULL,
  id_respuesta INT NOT NULL,
  gustar BOOLEAN NOT NULL,
  PRIMARY KEY (alias, id_respuesta),
  FOREIGN KEY (alias)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_respuesta)
    REFERENCES respuesta (id_respuesta)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE reportar_respuesta (
  alias VARCHAR (30) NOT NULL,
  id_respuesta INT NOT NULL,
  PRIMARY KEY (alias, id_respuesta),
  FOREIGN KEY (alias)
    REFERENCES usuario (alias)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_respuesta)
    REFERENCES respuesta (id_respuesta)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- CATEGORIAS

CREATE TABLE categoria (
  nombre VARCHAR (60) PRIMARY KEY CHECK (nombre <> '')
);

CREATE TABLE categorizar (
  nombre VARCHAR (60) NOT NULL,
  id_entrada INT NOT NULL,
  PRIMARY KEY (nombre, id_entrada),
  FOREIGN KEY (nombre)
    REFERENCES categoria (nombre)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (id_entrada)
    REFERENCES entrada (id_entrada)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

