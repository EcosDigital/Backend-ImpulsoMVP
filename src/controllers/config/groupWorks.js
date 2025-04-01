import { pool } from "../../config/db.js";

export const getGrupoRecentRequest = async (req, res) => {
  try {
    const id_escuela = req.user.id_escuela;
    const results = await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion => $1, id_escuela_p => $2)`,
      [1, id_escuela]
    );

    //obtener los datos  del query
    const grupos = results.rows[0].qry_grupos_trabajo || [];

    // Mapeo para ajustar la estructura
    const formattedGrupos = grupos.map((grupo) => ({
      id: grupo.id,
      nombre_grupo: grupo.nombre_grupo,
      docente: grupo.director_grupo, // Cambia "director_grupo" a "docente"
      tipo_prueba: grupo.tipo_prueba_icfes, // Cambia "tipo_prueba_icfes" a "tipo_prueba"
      estado: grupo.is_active ? "Activo" : "Inactivo", // Boolean a texto
    }));

    return res.status(200).json(formattedGrupos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const registerGrupoRequest = async (req, res) => {
  try {
    //datos del req body
    const { nombre_grupo, id_tipo_prueba_icfes, id_director_grupo, is_active } =
      req.body;
    //validar existencia del grupo por nombre en escuelas
    const results = await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion => $1, id_escuela_p => $2, nombre_grupo_p => $3)`,
      [2, req.user.id_escuela, nombre_grupo]
    );
    if (
      results.rows[0].qry_grupos_trabajo != null ||
      results.rows[0].qry_grupos_trabajo > 0
    ) {
      return res
        .status(409)
        .json({ message: "Ya existe un registro con este nombre..." });
    }
    //insertar registro
    await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion =>$1, id_escuela_p => $2, nombre_grupo_p => $3, id_tipo_prueba => $4, id_director => $5, estado => $6, id_usuario_p => $7)`,
      [
        3,
        req.user.id_escuela,
        nombre_grupo,
        id_tipo_prueba_icfes,
        id_director_grupo,
        is_active,
        req.user.id,
      ]
    );

    return res
      .status(200)
      .json({ message: "Registro almacenado correctamente..." });
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getTipoPruebaRequest = async (req, res) => {
  try {
    const results = await pool.query(`select * from educacion.ref_tipo_prueba_icfes`)
    return res.status(200).json(results.rows)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error inesperado!" });
  }
};

export const updateGrupoTrabajoRequest = async (req, res) => {
  try {
    //obtener el parametro del registro
    const { id } = req.params;
    //obtener datos del req body
    const { nombre_grupo, id_tipo_prueba_icfes, id_director_grupo, is_active } =
      req.body;
    //validar existencia de registro por id
    const results = await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion => $1, id_registro => $2)`,
      [2, id]
    );
    if (
      results.rows[0].qry_grupos_trabajo == null ||
      results.rows[0].qry_grupos_trabajo == 0
    ) {
      return res.status(404).json({ message: "Este registro no existe..." });
    }
    //actualizar registro
    await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion => $1, id_tipo_prueba => $2,  id_director => $3, estado => $4, nombre_grupo_p => $5, id_usuario_p => $6, id_registro => $7)`,
      [
        4,
        id_tipo_prueba_icfes,
        id_director_grupo,
        is_active,
        nombre_grupo,
        req.user.id,
        id,
      ]
    );

    return res
      .status(200)
      .json({ message: "Registro actualizado correctamente!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const addAlumnoToGrupoRequest = async (req, res) => {
  try {
    //obtener el parametro
    const { id_grupo } = req.params;
    //obtener datos de req body
    const { id_alumno } = req.body;
    //validar existencias
    const results = await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion => $1, id_registro => $2, id_alumno_p => $3)`,
      [5, id_grupo, id_alumno]
    );
    if (
      results.rows[0].qry_grupos_trabajo != null ||
      results.rows[0].qry_grupos_trabajo > 0
    ) {
      return res
        .status(409)
        .json({ message: "Este alumno ya ha sido registrado..." });
    }
    //insertar registro
    await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion => $1, id_registro => $2, id_escuela_p => $3, id_alumno_p => $4, id_usuario_p => $5)`,
      [6, id_grupo, req.user.id_escuela, id_alumno, req.user.id]
    );

    return res
      .status(200)
      .json({ message: "Registro almacenado correctamente..." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getAlumnosForGrupoRequest = async (req, res) => {
  try {
    //obtener parametro
    const { id_grupo } = req.params;
    const results = await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion => $1, id_escuela_p => $2, id_registro => $3)`,
      [5, req.user.id_escuela, id_grupo]
    );
    return res.status(200).json(results.rows[0].qry_grupos_trabajo);
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const deleteAlumnosForGrupoRequest = async (req, res) => {
  try {
    //obtener el parametro
    const { id } = req.params;
    
    //elimnar registro
    await pool.query(
      `SELECT educacion.qry_grupos_trabajo(operacion => $1, id_registro => $2)`, [7, id]
    );

    return res.status(200).json({message : "Registro eliminado exitosamente!"})

  } catch (error) {
    return res.status(500).json({message : "Hubo un error inesperado!"})
  }
};

export const getGrupoTrabajoRequest = async (req, res) => {
  try {
    //obtener el parametro
    const { id } = req.params;
    
    const results = await pool.query(`SELECT educacion.qry_grupos_trabajo(operacion => $1, id_registro => $2, id_escuela_p => $3)`, [2, id, req.user.id_escuela])
    if(results.rows[0].qry_grupos_trabajo == 0 || results.rows[0].qry_grupos_trabajo == null) {
      return res.status(404).json({message : "No se han encontrado resultados!" })
    }
    return res.status(200).json(results.rows[0].qry_grupos_trabajo[0])
  } catch (error) {
    return res.status(500).json({message : "Hubo un error inesperado!"})
  }
}