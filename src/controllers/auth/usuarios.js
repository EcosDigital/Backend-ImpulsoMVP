import { pool } from "../../config/db.js";
import bcrypt from "bcryptjs";

export const getUserRecentsRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, id_escuela_p => $2)`,
      [4, req.user.id_escuela]
    );
    if (
      results.rows[0].qry_usuarios == null ||
      results.rows[0].qry_usuarios == 0
    ) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultados" });
    }
    return res.status(200).json(results.rows[0].qry_usuarios);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getListTipoUserRequest = async (req, res) => {
  try {
    const results = await pool.query(
      "select * from configuracion.ref_tipo_usuario"
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json("Fallo inesperado");
  }
};

export const getTipoEstadoUserRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `select * from configuracion.ref_estdo_usuarios order by id`
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getUserForTerceroRequest = async (req, res) => {
  try {
    //obtener el parametro de id
    const { id } = req.params;
    const results = await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, id_tercero_param => $2)`,
      [5, id]
    );
    if (
      results.rows[0].qry_usuarios == 0 ||
      results.rows[0].qry_usuarios == null
    ) {
      const result = await pool.query(
        `SELECT td.codigo || ' - ' || t.numero_documento || ' - ' || t.primer_nombre ||
          COALESCE(' ' || t.segundo_nombre, '') ||
          COALESCE(' ' || t.primer_apellido, '') ||
          COALESCE(' ' || t.segundo_apellido, '') AS documento_nombre
        FROM configuracion.cfg_terceros t 
        JOIN configuracion.ref_tipo_documeto td ON td.id = t.id_tipo_documento
        WHERE t.id = $1`,
        [id]
      );
      return res.status(200).json(result.rows);
    }
    return res
      .status(409)
      .json({ message: "Ya hay un usuario atado a este tercero..." });
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const getInfoTerceroRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT td.codigo || ' - ' || t.numero_documento || ' - ' || t.primer_nombre ||
        COALESCE(' ' || t.segundo_nombre, '') ||
        COALESCE(' ' || t.primer_apellido, '') ||
        COALESCE(' ' || t.segundo_apellido, '') AS documento_nombre
      FROM configuracion.cfg_terceros t 
      JOIN configuracion.ref_tipo_documeto td ON td.id = t.id_tipo_documento
      WHERE t.id = $1`,
      [id]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getDataUsuarioRequest = async (req, res) => {
  try {
    //obtener el id del parametro
    const { id } = req.params;
    const results = await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, id_registro => $2)`,
      [6, id]
    );
    if (
      results.rows[0].qry_usuarios == 0 ||
      results.rows[0].qry_usuarios == null
    ) {
      return res.status(404).json({ message: "No se encontraron resultados" });
    }

    return res.status(200).json(results.rows[0].qry_usuarios[0]);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const createUserRequest = async (req, res) => {
  try {
    //obtener datos del req body
    const {
      idTercero,
      email,
      id_rol_usuario,
      id_estado_usuario,
      password,
      image_profile,
    } = req.body;

    //evaluar si se alcanzo el el limite de usaurios por licencia
    const limitUserSchool = await pool.query(
      `SELECT configuracion.qry_generalidades(operacion => $1, id_registro => $2)`,
      [10, req.user.id_escuela]
    );

    const cantUser = await pool.query(`SELECT auth.qry_auth(operacion => $1, id_escuela_p => $2)`, [
      6, req.user.id_escuela
    ]);

    if(cantUser >= limitUserSchool) {
      return res.status(429).json({message : "Has alcanzado el limite permitido de usuarios..."})
    }
    
    //evaluar existencia del usuario por email
    const results = await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, email_param => $2)`,
      [1, email]
    );
    if (
      results.rows[0].qry_usuarios > 0 ||
      results.rows[0].qry_usuarios != null
    ) {
      return res
        .status(409)
        .json({ message: "Ya existe un usuario con este email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    //insertar registro de usuario
    await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, email_param => $2, password_param => $3, id_rol_param => $4, id_escuela_p => $5, id_tercero_param => $6, id_tipo_usuario_param => $7, id_tipo_licencia_param => $8, fecha_act_licencia => $9, fecha_exp_licencia => $10, img_profile => $11, activo_param => $12, id_estado_param => $13)`,
      [
        2,
        email,
        passwordHash,
        id_rol_usuario,
        req.user.id_escuela,
        idTercero,
        1,
        6,
        new Date(),
        req.user.fecha_exp,
        image_profile,
        0,
        id_estado_usuario,
      ]
    );

    return res
      .status(200)
      .json({ message: "Registro almacenado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const updateUserRequest = async (req, res) => {
  try {
    //obtener el id del parametro
    const { id } = req.params;
    //obtener los datos del req body
    const {
      id_rol_usuario,
      id_estado_usuario,
      image_profile,
      //validar existencia del usuario por id
    } = req.body;

    const results = await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, id_registro => $2)`,
      [6, id]
    );
    if (
      results.rows[0].qry_usuarios == null ||
      results.rows[0].qry_usuarios == 0
    ) {
      return res
        .status(404)
        .json({ message: "No hay resultados por actualizar" });
    }

    //update registro de usuario
    await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, id_rol_param => $2, img_profile => $3, id_estado_param => $4, id_registro => $5)`,
      [7, id_rol_usuario, image_profile, id_estado_usuario, id]
    );

    return res
      .status(200)
      .json({ message: "Registro actualizado correctamente!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const updatePasswordUserRequest = async (req, res) => {
  try {
    //obtener el id de registro
    const { id } = req.params;
    //obtener data de req.body
    const { password } = req.body;

    //validar existencia de usuario por id
    const result = await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, id_registro => $2)`,
      [6, id]
    );
    if (
      result.rows[0].qry_usuarios == null ||
      result.rows[0].qry_usuarios == 0
    ) {
      return res
        .status(404)
        .json({ message: "No hay resultados por actualizar..." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    //actualizar registro
    await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, id_registro => $2, password_param => $3)`,
      [8, id, passwordHash]
    );

    return res
      .status(200)
      .json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const getHistorialSigninRequest = async (req, res) => {
  try {
    //obtener el id de registro
    const { id } = req.params;

    //validar existencia de usuario
    const data_user = await pool.query(
      `SELECT auth.qry_auth(operacion => $1, id_usuario_param => $2)`,
      [1, id]
    );
    if (data_user.rows[0].qry_auth == null || data_user.rows[0].qry_auth == 0) {
      return res.status(404).json({ message: "No existe el usuario..." });
    }

    //consultar historial de usuario
    const results = await pool.query(
      `SELECT auth.qry_auth(operacion => $1,  id_usuario_param => $2)`,
      [2, id]
    );
    //validar existencias
    if (results.rows[0].qry_auth == null || results.rows[0].qry_auth == 0) {
      return res
        .status(404)
        .json({ message: "No hay inicios de este usuario..." });
    }

    return res.status(200).json(results.rows[0].qry_auth);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un eror inesperado..." });
  }
};
