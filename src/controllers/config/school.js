import { pool } from "../../config/db.js";

import bcrypt from "bcryptjs";

export const registerSchoolRequest = async (req, res) => {
  try {
    //obtener los datos del req body
    const {
      nombre_escuela,
      nit,
      id_tipo_escuela,
      direccion_escuela,
      telefono_escuela,
      correo_institucional,
      id_departamento_institucional,
      id_ciudad_institucional,
      id_rango_estudiantes,
      id_rango_docentes,
      representante_legal,
      //data del tercero
      id_tipo_documento,
      numero_documento,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      id_departamento_tercero,
      id_ciudad_tercero,
      telefono_tercero,
      direccion_tercero,
      id_genero,
      fecha_nacimiento,
      //datos del usuario
      email_usuario,
      password,
      image_profile,
    } = req.body;

    //verificar existencia de la escuela
    const results = await pool.query(
      `SELECT configuracion.qry_escuelas($1, $2, $3)`,
      [1, nombre_escuela, nit]
    );
    if (results.rows[0].qry_escuelas > []) {
      return res
        .status(409)
        .json({ message: "Ya existe un registro con este nombre y/o nit" });
    }

    //verificar la exitencia del tercero (informacion personal)
    const validate_tercero = await pool.query(
      `SELECT configuracion.qry_terceros(operacion => $1, numero_documento_p => $2)`,
      [1, numero_documento]
    );
    if (validate_tercero.rows[0].qry_terceros > []) {
      return res.status(409).json({
        message: "Ya existe un usuario con este docuemnto personal...",
      });
    }

    //verificar la existencia del usuario
    const validate_usuario = await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, email_param => $2)`,
      [1, email_usuario]
    );
    if (validate_usuario.rows[0].qry_usuaros > []) {
      return res.status(409).json({
        message: "Ya este un usuario registrado con este email",
      });
    }

    //insertar el registro de escuela
    const insert_escuela = await pool.query(
      `SELECT configuracion.qry_escuelas($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        2,
        nombre_escuela,
        nit,
        id_tipo_escuela,
        direccion_escuela,
        telefono_escuela,
        correo_institucional,
        id_departamento_institucional,
        id_ciudad_institucional,
        representante_legal,
        id_rango_estudiantes,
        id_rango_docentes,
        1,
        new Date(new Date().setDate(new Date().getDate() + 5)),
      ]
    );
    const id_registro_escuela = insert_escuela.rows[0].qry_escuelas.id;

    //insertar el registro del tercero
    const insert_tercero = await pool.query(
      `SELECT configuracion.qry_terceros(operacion => $1, id_usuario_p => $2, id_escuela_p => $3, id_tipo_documento_p => $4, numero_documento_p => $5, fecha_nacimiento_p => $6, phone => $7, direccion_p => $8, id_genero_p => $9, alumno => $10, docente => $11, directivo => $12, primer_nombre_p => $13, segundo_nombre_p => $14, primer_apellido_p => $15, segundo_apellido_p => $16, id_dpto => $17, id_city => $18, email_p => $19)`,
      [
        2,
        1,
        id_registro_escuela,
        id_tipo_documento,
        numero_documento,
        fecha_nacimiento,
        telefono_tercero,
        direccion_tercero,
        id_genero,
        false,
        false,
        true,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_departamento_tercero,
        id_ciudad_tercero,
        email_usuario,
      ]
    );
    const id_registro_tercero = insert_tercero.rows[0].qry_terceros.id;

    //hasheaer contraseñas
    const passwordHash = await bcrypt.hash(password, 10);

    //insertar el registro del tercero
    const insert_usuario = await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, email_param => $2, password_param => $3, id_rol_param => $4, id_escuela_p => $5, id_tercero_param => $6, id_tipo_usuario_param => $7, id_tipo_licencia_param => $8, fecha_act_licencia => $9, fecha_exp_licencia => $10, img_profile => $11, activo_param => $12, id_estado_param => $13 )`,
      [
        2,
        email_usuario,
        passwordHash,
        2,
        id_registro_escuela,
        id_registro_tercero,
        2,
        1,
        new Date(),
        new Date(new Date().setDate(new Date().getDate() + 5)),
        image_profile,
        false,
        1,
      ]
    );

    const id_registro_usuario = insert_usuario.rows[0].qry_usuarios.id;

    return res.status(200).json({
      message: "Registro Almacenado exitosamente!",
      id_usuario: id_registro_usuario,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const UpdateLicenciaSchoolRequest = async (req, res) => {
  try {
    //obtener deta del req body
    const { id_licencia_school, nit } = req.body;

    //evaluar si es licencia gratis
    const fechaExpiracion =
      id_licencia_school === 1
        ? new Date(new Date().setDate(new Date().getDate() + 5))
        : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    await pool.query(
      `SELECT configuracion.qry_escuelas(operacion => $1, id_tipo_licencia_param => $2, fecha_exp => $3, nit_param => $4)`,
      [3, id_licencia_school, fechaExpiracion, nit]
    );

    const result = await pool.query(
      `select * from configuracion.cfg_escuelas where nit = $1`,
      [nit]
    );

    const idEscuela = result.rows[0].id;

    await pool.query(
      `SELECT configuracion.qry_usuarios(operacion => $1, id_tipo_licencia_param => $2, fecha_exp_licencia => $3, id_escuela_p => $4)`,
      [3, 6, fechaExpiracion, idEscuela]
    );

    return res.status(200).json({ message: "Licencia actualizada con exito" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const getListSchoolRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT configuracion.qry_escuelas(operacion => $1)`,
      [4]
    );

    if (
      results.rows[0].qry_escuelas == 0 ||
      results.rows[0].qry_escuelas == null
    ) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultados..." });
    }

    res.status(200).json(results.rows[0].qry_escuelas);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const getSchoolRequest = async (req, res) => {
  try {
    //obtener el id del parametro
    const { id } = req.params;
    //validar existencia del registro
    const results = await pool.query(
      "SELECT configuracion.qry_escuelas(operacion => $1, id_registro => $2)",
      [5, id]
    );
    res.status(200).json(results.rows[0].qry_escuelas[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const updateScholRequest = async (req, res) => {
  try {
    //obtener el id del param
    const { id } = req.params;
    //obtener los datos del req.body
    const {
      nombre_escuela,
      id_tipo_escuela,
      telefono,
      direccion,
      correo_contacto,
      id_departamento,
      id_ciudad,
      id_cantidad_estudiantes,
      representante_legal,
      id_cantidad_docentes,
      id_licencia,
      estado,
      principal,
    } = req.body;

    //revisar que tipo de licencia usara
    const fecha_limit = new Date(
      new Date().setDate(new Date().getDate() + (id_licencia == 1 ? 5 : 365))
    );

    //actualizar el registro
    await pool.query(
      `SELECT configuracion.qry_escuelas (operacion => $1, nombre_escuela_param => $2, id_tipo_escuela_param => $3, telefono_param => $4, direccion_param => $5, correo_contacto_param => $6, id_departamento_param => $7, id_ciudad_param => $8, representante_legal_param => $9, id_cantidad_estudiantes_param => $10, id_cantidad_docentes_param => $11, id_tipo_licencia_param => $12, estado => $13, principal_param => $14, fecha_exp => $15, id_usuario_param => $16, id_registro => $17)`,
      [
        6,
        nombre_escuela,
        id_tipo_escuela,
        telefono,
        direccion,
        correo_contacto,
        id_departamento,
        id_ciudad,
        representante_legal,
        id_cantidad_estudiantes,
        id_cantidad_docentes,
        id_licencia,
        estado,
        principal,
        fecha_limit,
        req.user.id,
        id
      ]
    );

    return res.status(200).json({message : "Registro actualizado exitosamente..."})

  } catch (error) {
    return res.status(500).json({message: "Hubo un error inesperado!"})
  }
};
