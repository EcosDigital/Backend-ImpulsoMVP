import { pool } from "../../config/db.js";

export const getClasificacionEscolarRequest = async (req, res) => {
  const results = await pool.query(
    "SELECT educacion.qry_clasificacion_alumnos(operacion => $1, id_escuela_p => $2)",
    [1, req.user.id_escuela]
  );
  res.status(200).json(results.rows[0].qry_clasificacion_alumnos);
};

export const getClasificacionGrupalRequest = async (req, res) => {
  //obtener parametro
  const { id_grupo } = req.params;
  const results = await pool.query(
    "SELECT educacion.qry_clasificacion_alumnos(operacion => $1, id_escuela_p => $2, id_grupo_p => $3)",
    [1, req.user.id_escuela, id_grupo]
  );
  res.status(200).json(results.rows[0].qry_clasificacion_alumnos);
};

export const getRankinForAreaRequest = async (req, res) => {
  try {
    const { id_area, id_grupo } = req.body;
    

    const results = await pool.query(
      `SELECT educacion.qry_clasificacion_alumnos(operacion => $1, id_escuela_p => $2, id_grupo_p => $3, id_area_p => $4)`,
      [2, req.user.id_escuela, id_grupo, id_area]
    );

    res.status(200).json(results.rows[0].qry_clasificacion_alumnos)

  } catch (error) {
    console.log(error);
    
    res.status(500).json({error : "Hubo un error inesperado!"})
  }
};
