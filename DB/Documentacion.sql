-- USUARIO

COMMENT ON TABLE usuario IS 'Tabla de usuarios del sistema';
COMMENT ON COLUMN usuario.alias IS 'Identificador único de cada usuario de no más de 30 caracteres';
COMMENT ON COLUMN usuario.biografia IS 'Breve biografía (opcional)';
COMMENT ON COLUMN usuario.correo IS 'Correo electrónico';
COMMENT ON COLUMN usuario.residencia IS 'Pais de residencia (opcional)';
COMMENT ON COLUMN usuario.publico IS 'Booleano que determina si el perfil es público o no, es Falso por defecto';
COMMENT ON COLUMN usuario.fecha_nacimiento IS 'Fecha de nacimiento';
COMMENT ON COLUMN usuario.foto_perfil IS 'Foto de perfil (opcional)';
COMMENT ON COLUMN usuario.contrasenia IS 'Contraseña (su hash) del usuario';
COMMENT ON COLUMN usuario.nombre IS 'Nombre';
COMMENT ON COLUMN usuario.paterno IS 'Apellido paterno';
COMMENT ON COLUMN usuario.materno IS 'Apellido materno';
COMMENT ON COLUMN usuario.eliminado IS 'Booleano que indica si es perfil ha sido borrado o no, apoya en el "soft delete" para mantener la integridad referencial con los mensajes.';

-- ADMINISTRADOR

COMMENT ON TABLE administrador IS 'Tabla de administradores del sistema, son "super usuarios"';
COMMENT ON COLUMN administrador.alias IS 'Identificador único del administrador en la tabla de usuarios';

-- SEGUIR USUARIO

COMMENT ON TABLE seguir_usuario IS 'Tabla para manejar la acción de seguir a un usuario';
COMMENT ON COLUMN seguir_usuario.alias_seguidor IS 'Identificador del usuario que sigue';
COMMENT ON COLUMN seguir_usuario.alias_seguido IS 'Identificador del usuario que es seguido';

-- REPORTAR USUARIO

COMMENT ON TABLE reportar_usuario IS 'Tabla para manejar la acción de reportar a un usuario';
COMMENT ON COLUMN reportar_usuario.alias_reporta IS 'Identificador del usuario que reporta';
COMMENT ON COLUMN reportar_usuario.alias_reportado IS 'Identificador del usuario que es reportado';
COMMENT ON COLUMN reportar_usuario.motivo IS 'Breve motivo del reporte';
COMMENT ON COLUMN reportar_usuario.comentario IS 'Comentario más concreto sobre el reporte (opcional)';

-- MENSAJE

COMMENT ON TABLE mensaje IS 'Tabla de los mensajes entre usuarios';
COMMENT ON COLUMN mensaje.id_mensaje IS 'Identificador único del mensaje';
COMMENT ON COLUMN mensaje.alias_usuario_rem IS 'Identificador del usuario remitente';
COMMENT ON COLUMN mensaje.alias_usuario_dest IS 'Identificador del usuario destinatario';
COMMENT ON COLUMN mensaje.id_mensaje_respuesta IS 'Identificador del mensaje que se responde (opcional)';
COMMENT ON COLUMN mensaje.contenido IS 'Contenido del mensaje';
COMMENT ON COLUMN mensaje.fecha IS 'Fecha (timestamp) en que se envío, por defecto es CURRENT_TIMESTAMP';

-- ENTRADA

COMMENT ON TABLE entrada IS 'Tabla general de todas las entradas';
COMMENT ON COLUMN entrada.id_entrada IS 'Identificador único de cada entrada';
COMMENT ON COLUMN entrada.enlace IS 'Enlace a la página de la entrada';
COMMENT ON COLUMN entrada.imagen IS 'Imagen de portada de la entrada';
COMMENT ON COLUMN entrada.sinopsis IS 'Breve sinopsis de la entrada';
COMMENT ON COLUMN entrada.titulo IS 'Titulo de la entrada';
COMMENT ON COLUMN entrada.estreno IS 'Fecha de estreno de la entrada';
COMMENT ON COLUMN entrada.clasificacion IS 'Clasificación de la entrada de acuerdo al estandar de la RTC en México';
COMMENT ON COLUMN entrada.tipo IS 'Tipo de la entrada: p por Pelicula, s por Serie y c por Capítulo';

-- CELEBRIDAD

COMMENT ON TABLE celebridad IS 'Tabla de las celebridades';
COMMENT ON COLUMN celebridad.id_celebridad IS 'Identificador único de cada celebridad';
COMMENT ON COLUMN celebridad.nombre IS 'Nombre completo de la celebridad';
COMMENT ON COLUMN celebridad.biografia IS 'Biografía de la celebridad';
COMMENT ON COLUMN celebridad.foto IS 'Foto de la celebridad';

-- SEGUIR CELEBRIDAD

COMMENT ON TABLE seguir_celebridad IS 'Tabla para la manejar la acción de seguir celebridades';
COMMENT ON COLUMN seguir_celebridad.alias IS 'Identificador del usuario que sigue a la celebridad';
COMMENT ON COLUMN seguir_celebridad.id_celebridad IS 'Identificador de la celebridad seguida';

-- TRABAJAR

COMMENT ON TABLE trabajar IS 'Tabla para la manejar la relación entre celebridades y entradas';
COMMENT ON COLUMN trabajar.id_celebridad IS 'Identificador de la celebridad que trabajó en la entrada';
COMMENT ON COLUMN trabajar.id_entrada IS 'Identificador de la entrada en la que la celebridad trabajó';

-- ROL

COMMENT ON TABLE rol IS 'Tabla que almacena los roles que cada celebridad desempeñó en una determinada entrada';
COMMENT ON COLUMN rol.id_celebridad IS 'Identificador de la celebridad';
COMMENT ON COLUMN rol.id_entrada IS 'Identificador de la entrada';
COMMENT ON COLUMN rol.rol IS 'Rol que desempeñó';

-- LISTA REPRODUCCION

COMMENT ON TABLE lista_reproduccion IS 'Tabla para manejar las listas de películas de los usuarios';
COMMENT ON COLUMN lista_reproduccion.nombre IS 'Nombre de la lista';
COMMENT ON COLUMN lista_reproduccion.alias IS 'Identificador del usuario dueño';
COMMENT ON COLUMN lista_reproduccion.publica IS 'Booleano que determina si la lista es pública o no, por defecto es Falso';
COMMENT ON COLUMN lista_reproduccion.fecha_creacion IS 'Fecha de la creación de la lista';
COMMENT ON COLUMN lista_reproduccion.fecha_ultima_mod IS 'Fecha de la última modificación a la lista';
COMMENT ON COLUMN lista_reproduccion.descripcion IS 'Breve descripción';

-- CONTENER

COMMENT ON TABLE contener IS 'Tabla para manejar las entradas que una lista contiene';
COMMENT ON COLUMN contener.id_entrada IS 'Identificador de la entrada';
COMMENT ON COLUMN contener.nombre_lista_rep IS 'Nombre de la lista';
COMMENT ON COLUMN contener.alias IS 'Identificador del usuario dueño de la lista';

-- PELICULA

COMMENT ON TABLE pelicula IS 'Tabla para las peliculas';
COMMENT ON COLUMN Pelicula.id_pelicula IS 'Identificador único de cada película, debe existir en la tabla Entrada';
COMMENT ON COLUMN Pelicula.duracion IS 'Duración de la película en minutos';

-- SERIE

COMMENT ON TABLE serie IS 'Tabla para las series';
COMMENT ON COLUMN serie.id_serie IS 'Identificador único de cada serie, debe existir en la tabla Entrada';
COMMENT ON COLUMN serie.emision IS 'Estado de la serie, TRUE si la series estan en emision, FALSE en otro caso';

-- CAPITULO

COMMENT ON TABLE capitulo IS 'Tabla para los capitulos de las series';
COMMENT ON COLUMN capitulo.id_capitulo IS 'Identificador único de cada capítulo, debe existir en la tabla Entrada';
COMMENT ON COLUMN capitulo.id_serie IS 'Identificador de la serie a la que pertence';
COMMENT ON COLUMN capitulo.temporada IS 'Temporada de la serie a la que pertenece';
COMMENT ON COLUMN capitulo.no_cap IS 'Número de capítulo';
COMMENT ON COLUMN capitulo.duracion IS 'Duración del capítulo en minutos';

-- VALORACION

COMMENT ON TABLE valoracion IS 'Tabla para las valoraciones de cada entrada';
COMMENT ON COLUMN valoracion.id_valoracion IS 'Identificador único de cada valoración';
COMMENT ON COLUMN valoracion.id_entrada IS 'Identificador de la entrada que valora';
COMMENT ON COLUMN valoracion.calificacion IS 'Calificación de la valoración de 1 a 5';

-- RESPUESTA

COMMENT ON TABLE respuesta IS 'Tabla para las respuestas a valoraciones';
COMMENT ON COLUMN respuesta.id_respuesta IS 'Identificador único de cada respuesta';
COMMENT ON COLUMN respuesta.id_valoracion IS 'Identificador de la valoración a la que responden';
COMMENT ON COLUMN respuesta.alias IS 'Identificador del usuario que creó la respuesta';
COMMENT ON COLUMN respuesta.mensaje IS 'Mensaje de la respuesta';
COMMENT ON COLUMN respuesta.fecha IS 'Fecha en que se creó la respuesta, por defecto es el valor de CURRENT_TIMESTAMP';

-- EVALUAR

COMMENT ON TABLE evaluar IS 'Tabla para manejar la relación entre los usuarios que evaluan respuestas';
COMMENT ON COLUMN evaluar.alias IS 'Identificador del usuario que evalua la respuesta';
COMMENT ON COLUMN evaluar.id_respuesta IS 'Identificador de la respuesta evaluada';
COMMENT ON COLUMN evaluar.gustar IS 'Valor de la evaluación, TRUE para "me gusta", FALSE para "no me gusta"';

-- REPORTAR RESPUESTA

COMMENT ON TABLE reportar_respuesta IS 'Tabla para manera la relación entre los usurarios y las respuestas que reportan';
COMMENT ON COLUMN reportar_respuesta.alias IS 'Identificador del usuario que reporta la respuesta';
COMMENT ON COLUMN reportar_respuesta.id_respuesta IS 'Identificador de la respuesta reportada';

-- CATEGORIA

COMMENT ON TABLE categoria IS 'Tabla de las posibles categorías';
COMMENT ON COLUMN categoria.nombre IS 'Nombre de la categoría, debe de ser único';

-- CATEGORIZAR

COMMENT ON TABLE categorizar IS 'Tabla que maneja la relación entre las categorías y las entradas';
COMMENT ON COLUMN categorizar.nombre IS 'Nombre de la categoría';
COMMENT ON COLUMN categorizar.id_entrada IS 'Identificador de la entrada que se categoriza';

