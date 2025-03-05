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
    } = req.body;

    //insertar registro
    await pool.query(
      `SELECT educacion.qry_quiz(operacion => $1, id_usuario_param => $2, id_tipo_quiz => $3, preguntas_acertadas => $4, preguntas_falladas => $5, porcentaje_final => $6, porcentaje_correcto => $7, tiempo_estimado => $8, NIVEL_DIFICULTAD => $9)`,
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
      ]
    );

    return res.status(200).json({message : 'Resultados almacenados correctamente'})

  } catch (error) {
    console.log(error);
    return res.status(500).json({message : 'Hubo un error inesperado!'})
  }
};
