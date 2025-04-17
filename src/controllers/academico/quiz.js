import { pool } from "../../config/db.js";

export const registerResultadoQuiz = async (req, res) => {
  try {
    //obtener los datos de req body
    const {
      id_tipo_prueba,
      preguntas_correctas,
      preguntas_incorrectas,
      porcentaje,
      tiempo_estimado,
      id_nivel_dificultad,
      detalle,
    } = req.body;

    //insertar registro
    const resultado = await pool.query(
      `SELECT educacion.qry_quiz(operacion => $1, id_usuario_param => $2, id_tipo_quiz => $3, preguntas_acertadas => $4, preguntas_falladas => $5, porcentaje_final => $6, porcentaje_correcto => $7, tiempo_estimado => $8, NIVEL_DIFICULTAD => $9, id_escuela_p => $10)`,
      [
        2,
        req.user.id,
        id_tipo_prueba,
        preguntas_correctas,
        preguntas_incorrectas,
        porcentaje,
        porcentaje,
        tiempo_estimado,
        id_nivel_dificultad,
        req.user.id_escuela,
      ]
    );

    //insertar el detalle del registro
    const id_resultado =  parseInt(resultado.rows[0].qry_quiz.id, 10);

    for (let i = 0; i < detalle.length; i++) {
      //definir el area segun su nombre y ID
      const areaMap = {
        "Lectura Crítica": 1,
        "Matemáticas": 2,
        "Ciencias Naturales": 3,
        "Sociales y Ciudadanas": 4,
        "Inglés": 5,
      };

      const id_area = areaMap[detalle[i].area] ?? 0;

      await pool.query(
        `SELECT educacion.qry_quiz(operacion => $1, id_resultado_p => $2, id_escuela_p => $3, id_area_P => $4, preguntas_acertadas => $5, total_preguntas_p => $6, porcentaje_correcto => $7)`,
        [
          3,
          id_resultado,
          req.user.id_escuela,
          id_area,
          detalle[i].correct,
          detalle[i].total,
          detalle[i].percentage,
        ]
      );
    }

    return res
      .status(200)
      .json({ message: "Resultados almacenados correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};
