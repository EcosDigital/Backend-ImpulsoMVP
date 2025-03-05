import { pool } from "../../config/db.js";

export const getAreaEstudioRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT educacion.qry_preguntas(operacion => $1)`,
      [3]
    );
    return res.status(200).json(results.rows[0].qry_preguntas);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getNivelDificultadRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT educacion.qry_preguntas(operacion => $1)`,
      [4]
    );
    return res.status(200).json(results.rows[0].qry_preguntas);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un eror ineperado!" });
  }
};

export const registerPreguntaRequest = async (req, res) => {
  try {
    //obtener datos del req body
    const {
      texto_apoyo,
      ilustracion_apoyo,
      texto_pregunta,
      texto_pista,
      texto_explicacion,
      id_area,
      id_nivel,
      tiempo_estimado,
      is_active,
      is_ia,
      respuestas,
    } = req.body;
    //registrar pregunta y obtener el id

    //convertir texto a json
    const jsonText = { parrafo: texto_apoyo };

    const results = await pool.query(
      `SELECT educacion.qry_preguntas(operacion => $1, texto_apoyo_param => $2, ilustracion_apoyo_param => $3, texto_pregunta_param => $4,
    id_area_param => $5, id_nivel_param => $6, tiempo_estimado_param => $7, id_user => $8, parametro_estado => $9, is_ia => $10, texto_pista_param => $11, texto_explicacion_param => $12)`,
      [
        1,
        jsonText,
        ilustracion_apoyo,
        texto_pregunta,
        id_area,
        id_nivel,
        tiempo_estimado,
        req.user.id,
        is_active,
        is_ia,
        texto_pista,
        texto_explicacion,
      ]
    );

    const id_pregunta = results.rows[0].qry_preguntas.id;

    //recorer e insertar cada pregunta
    async function insertarRespuestas() {
      for (const item of respuestas) {
        await pool.query(
          `SELECT educacion.qry_preguntas(operacion => $1, id_pregunta_param => $2, texto_respuesta_param => $3, es_correcta_param => $4)`,
          [2, id_pregunta, item.texto, item.is_correcto]
        );
      }
    }

    insertarRespuestas();

    return res
      .status(200)
      .json({ message: "Registro almacenado correctamente" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const getPreguntasForQuizRequest = async (req, res) => {
  try {
    //obtener datos de req body
    const {
      cantidad_preguntas,
      id_nivel_dificultad,
      lectura_critica,
      matematicas,
      ciencias_naturales,
      sociales,
      ingles,
    } = req.body;
    //realizar consulta de preguntas y respuestas
    /*const results = await pool.query(
      `SELECT 
          p.id AS pregunta_id,
          p.texto_apoyo->>'parrafo' as texto_apoyo,
          p.ilustracion_apoyo,
          p.texto_pregunta,
          a.nombre as area,
          n.nombre as nivel_dificultad,
          p.tiempo_estimado,
          p.texto_pista,
          p.texto_explicacion,
          json_agg(
              json_build_object(
                  'id', r.id,
                  'texto_respuesta', r.texto_respuesta,
                  'es_correcta', r.es_correcta
              )
          ) AS respuestas
      FROM educacion.cfg_preguntas p
      LEFT JOIN educacion.cfg_respuestas r ON p.id = r.id_pregunta
      LEFT JOIN educacion.ref_area_estudio a ON p.id_area = a.id
      LEFT JOIN educacion.ref_nivel_dificultad n ON n.id = p.id_nivel
      WHERE p.id IN (
          SELECT id FROM educacion.cfg_preguntas ORDER BY RANDOM() LIMIT 10
      )
      GROUP BY p.id, p.texto_pregunta, p.texto_apoyo, p.ilustracion_apoyo, a.nombre, n.nombre,       p.tiempo_estimado, p.texto_pista, p.texto_explicacion;`
    );*/

    const results = await pool.query(
      `SELECT educacion.qry_quiz(operacion => $1, limite_preguntas => $2, nivel_dificultad => $3, area_lectura_critica => $4, area_matematicas => $5, area_ciencias_naturales => $6, area_ciencias_sociales => $7, area_ingles => $8)`,
      [
        1,
        cantidad_preguntas,
        id_nivel_dificultad,
        lectura_critica,
        matematicas,
        ciencias_naturales,
        sociales,
        ingles,
      ]
    );

    return res.status(200).json(results.rows[0].qry_quiz);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
