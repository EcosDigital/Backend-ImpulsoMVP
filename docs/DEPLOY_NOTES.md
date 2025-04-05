## VERSSION 0.0.6 (TABLA DE PUNTUACION)

## Adicionar campo 
adicionar un campo "id_Escuela" en educacion.cfg_resultados
ALTER TABLE educacion.cfg_resultad ADD COLUMN id_escuela INT

## modificacion de controlador
se modifico el controlador que inserta los resultados
para lograr registrar el parametro id_escuela

## modifiacion del sp
se modifico la funcion en DB "educacion.qry_quiz"
con el objetivo de lograr registrar el parametro id_escuela

## Creacion del sp para listar las puntaciones
CREATE OR REPLACE FUNCTION educacion.qry_clasificacion_alumnos(
    OPERACION INTEGER DEFAULT NULL,
    id_escuela_p INTEGER DEFAULT NULL,
    id_grupo_p INTEGER DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
    resultado jsonb;
BEGIN
    CASE
        WHEN operacion = 1 THEN
            SELECT to_jsonb(array_agg(t))
            INTO resultado
            FROM (
                SELECT 
                    t.primer_nombre || ' ' || t.primer_apellido as alumno,
                    g.nombre_grupo,
                    SUM(
                        CASE 
                            WHEN r.id_nivel_dificultad = 1 THEN r.porcentaje_total * 0.20
                            WHEN r.id_nivel_dificultad = 2 THEN r.porcentaje_total * 0.30
                            WHEN r.id_nivel_dificultad = 3 THEN r.porcentaje_total * 0.50
                            ELSE 0
                        END
                    ) AS puntaje_total,
                    CAST(
                        SUM(r.porcentaje_aciertos * 0.10) AS INTEGER
                    ) AS preguntas_acertadas,
                    SUM(
                        preguntas_incorrectas
                    )as preguntas_fallidas
                FROM educacion.cfg_resultados r
                JOIN configuracion.cfg_usuarios u on u.id = r.id_usuario
                JOIN configuracion.cfg_terceros t on t.id = u.id_tercero
                JOIN educacion.cfg_grupos_trabajo_alumnos gt on gt.id_alumno = t.id
                JOIN educacion.cfg_grupos_de_trabajo g on g.id = gt.id_grupo_trabajo
                WHERE r.id_tipo_prueba = 1 AND id_escuela = id_escuela_p
                AND (id_grupo_p IS NULL OR gt.id_grupo = id_grupo_p)
                GROUP BY t.primer_nombre, t.primer_apellido, g.nombre_grupo
                ORDER BY puntaje_total DESC
            ) t;

            RETURN resultado;

    END CASE;
END;
$function$;

