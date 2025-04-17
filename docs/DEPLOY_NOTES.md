## PATH VERSSION 0.0.7 (DETALLE DE LOS RESULTADOS QUIZ)

Crear tabla para almacenar los  detalles por area
de resultados y ofrecer mejor clasificacion

CREATE TABLE educacion.mov_detalle_resultados(
    id SERIAL PRIMARY KEY NOT NULL,
    id_resultado INT NOT NULL REFERENCES educacion.cfg_resultados(id),
    id_escuela INT NOT NULL REFERENCES configuracion.cfg_escuelas(id),
    id_area INT NOT NULL REFERENCES educacion.ref_area_de_estudio(id),
    preguntas_correctas INT NOT NULL,
    total_preguntas INT NOT NULL,
    presicion_aciertos INT NOT NULL
);

## NOTA: ACTUALIZAR EL QRY_QUIZ
