## CREAR LAS TABLAS PARA LA SECCION GRUPOS DE TRABAJO

CREATE TABLE educacion.ref_tipo_prueba_icfes(
        id serial primary key not null,
        nombre varchar(60) not null);

CREATE TABLE educacion.cfg_grupos_de_trabajo(
        id serial primary key not null,
        id_escuela int not null REFERENCES configuracion.cfg_escuelas(id),
        nombre_grupo varchar(200) not null,
        id_tipo_prueba_icfes int not null REFERENCES educacion.ref_tipo_prueba(id),
        id_director_grupo int not null REFERENCES configuracion.cfg_terceros(id),
        is_active boolean not null,
        id_usuario_at int not null REFERENCES configuracion.cfg_usuarios(id),        
        created_at timestamp not null,
        update_at timestamp);

CREATE TABLE educacion.cfg_grupos_trabajo_alumnos (
        id serial primary key not null,
        id_grupo_trabajo int not null REFERENCES educacion.cfg_grupos_de_trabajo,
        id_escuela int not null REFERENCES configuracion.cfg_escuelas(id),
        id_alumno int not null REFERENCES configuracion.cfg_terceros(id),
        id_usuario_at int not null REFERENCES configuracion.cfg_usuarios(id),
        created_at timestamp not null)

 INSERT INTO educacion.ref_tipo_prueba_icfes(nombre) values('Saber 11 ');

 ## NOTA IMPORTATE : CREAR EL SP QRY_GRUPOS FOR SCHEMA EDUCACION ##
