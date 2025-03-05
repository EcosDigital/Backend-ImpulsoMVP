import { pool } from "../../config/db.js";

export const getRecentsTercerosRequest = async (req, res) => {
  try {
    const id_escuela = req.user.id_escuela;
    const results = await pool.query(
      `SELECT configuracion.qry_terceros (operacion => $1, id_escuela_p => $2)`,
      [3, id_escuela]
    );
    return res.status(200).json(results.rows[0].qry_terceros);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const registerTerceroRequest = async (req, res) => {
  try {
    //obtener los datos del req body
    const {
      id_tipo_documento,
      numero_documento,
      fecha_nacimiento,
      telefono,
      direccion,
      id_genero,
      es_alumno,
      es_docente,
      es_directivo,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      id_departamento,
      id_ciudad,
      email_contacto,
    } = req.body;
    //validar existencia del tercero por numero documento
    const results = await pool.query(
      `SELECT configuracion.qry_terceros(operacion => $1, numero_documento_p => $2, id_escuela_p => $3)`,
      [1, numero_documento, req.user.id_escuela]
    );
    if (
      results.rows[0].qry_terceros != null ||
      results.rows[0].qry_terceros > 0
    ) {
      return res
        .status(409)
        .json({ message: "Ya existe un registro con este documento" });
    }
    //insertar registro de tercero
    await pool.query(
      `SELECT configuracion.qry_terceros(operacion => $1, id_usuario_p => $2, id_escuela_p => $3, id_tipo_documento_p => $4, numero_documento_p => $5, fecha_nacimiento_p => $6, phone => $7, direccion_p => $8, id_genero_p => $9, alumno => $10, docente => $11,  directivo => $12, primer_nombre_p => $13, segundo_nombre_p => $14, primer_apellido_p => $15, segundo_apellido_p => $16, id_dpto => $17, id_city => $18, email_p => $19)`,
      [
        2,
        req.user.id,
        req.user.id_escuela,
        id_tipo_documento,
        numero_documento,
        fecha_nacimiento,
        telefono,
        direccion,
        id_genero,
        es_alumno,
        es_docente,
        es_directivo,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_departamento,
        id_ciudad,
        email_contacto,
      ]
    );

    return res
      .status(200)
      .json({ message: "Registro almacenado corretamente..." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getTerceroRequest = async (req, res) => {
  try {
    //obtener el id del parametro
    const { id } = req.params;
    //consultar registro del tercero por id
    const results = await pool.query(
      `SELECT configuracion.qry_terceros(operacion => $1, id_registro => $2)`,
      [5, id]
    );
    return res.status(200).json(results.rows[0].qry_terceros[0]);
  } catch (error) {}
};

export const updateTerceroRequest = async (req, res) => {
  try {
    //obtener el aprametro de registro
    const { id } = req.params;
    //obtener datos del req body
    const {
      id_tipo_documento,
      numero_documento,
      fecha_nacimiento,
      telefono,
      direccion,
      id_genero,
      es_alumno,
      es_docente,
      es_directivo,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      id_departamento,
      id_ciudad,
      email_contacto,
    } = req.body;

    //validar existencia de usuario por numero documento
    const results = await pool.query(
      `SELECT configuracion.qry_terceros(operacion => $1, numero_documento_p => $2, id_escuela_p => $3)`,
      [1, numero_documento, req.user.id_escuela]
    );

    if (
      results.rows[0].qry_terceros == null ||
      results.rows[0].qry_terceros == 0
    ) {
      return res.status(404).json({ message: "El registro no existe" });
    }

    // actualizar registro
    await pool.query(
      "SELECT configuracion.qry_terceros(operacion => $1, id_usuario_p => $2, id_tipo_documento_p => $3, fecha_nacimiento_p => $4, phone => $5, direccion_p => $6,  id_genero_p => $7, alumno => $8, docente => $9, directivo => $10, primer_nombre_p => $11, segundo_nombre_p => $12, primer_apellido_p => $13, segundo_apellido_p => $14, id_dpto => $15, id_city => $16,     email_p => $17, id_registro => $18)",
      [
        4,
        req.user.id,
        id_tipo_documento,
        fecha_nacimiento,
        telefono,
        direccion,
        id_genero,
        es_alumno,
        es_docente,
        es_directivo,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_departamento,
        id_ciudad,
        email_contacto,
        id,
      ]
    );

    return res
      .status(200)
      .json({ message: "Registro actualizado correctamente!" });
      
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Hubo un error inesperado...' });
  }
};

