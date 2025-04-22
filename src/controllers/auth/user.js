import { pool } from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { createAccessToken } from "../../libs/jwt.js";
import { TOKEN_SECRET } from "../../config/config.js";

export const loginAfterSignupRequest = async (req, res) => {
  try {
    //recuperar datos del parametro
    const { id_user } = req.params;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    //validar existencia de usuario
    const results = await pool.query(
      `SELECT auth.qry_auth (operacion => $1, id_usuario_param => $2)`,
      [1, id_user]
    );

    if (results.rows[0].qry_auth == 0 || results.rows[0].qry_auth == null) {
      return res.status(404).json({ message: "Exte usuario no existe" });
    }

    //validar inicios de session del usuario
    const resultsLogin = await pool.query(
      `SELECT auth.qry_auth (operacion => $1, id_usuario_param => $2)`,
      [2, id_user]
    );

    if (
      resultsLogin.rows[0].qry_auth == 0 ||
      resultsLogin.rows[0].qry_auth == null
    ) {
      //insertar registro de inicio de session
      const insert_session = await pool.query(
        `SELECT auth.qry_auth (operacion => $1, id_usuario_param => $2, fecha_inicio_param => $3, hora_inicio_param => $4, fecha_cierre_param => $5, hora_cierre_param => $6, ip_maquina_param => $7)`,
        [
          3,
          id_user,
          new Date().toISOString().slice(0, 10),
          new Date().toTimeString().slice(0, 8),
          null,
          null,
          ip,
        ]
      );

      const id_inicio_session = insert_session.rows[0].qry_auth.id;

      const emailParam = results.rows[0].qry_auth[0].email;

      const data_user = await pool.query(
        `SELECT auth.qry_auth(operacion => $1, email_param => $2)`,
        [4, emailParam]
      );

      //inicar session del usuario
      const token = await createAccessToken({
        id: data_user.rows[0].qry_auth[0].id,
        email: data_user.rows[0].qry_auth[0].email,
        id_rol: data_user.rows[0].qry_auth[0].id_rol,
        id_escuela: data_user.rows[0].qry_auth[0].id_escuela,
        id_tipo_usuario: data_user.rows[0].qry_auth[0].id_tipo_usuario,
        imagen_profile: data_user.rows[0].qry_auth[0].image_profile,
        id_tercero: data_user.rows[0].qry_auth[0].id_tercero,
        nombre_usuario:
          data_user.rows[0].qry_auth[0].primer_nombre +
          " " +
          data_user.rows[0].qry_auth[0].primer_apellido,
        id_tipo_licencia: data_user.rows[0].qry_auth[0].id_tipo_licencia,
        fecha_exp: data_user.rows[0].qry_auth[0].fecha_expiracion_licencia,
        id_inicio_session: id_inicio_session,
      });

      res.cookie("token", token);

      res.json(token);
    } else {
      return res.status(409).json({ message: "Error al iniciar session" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const verifyTokenRequest = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No hay token" });

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
      if (error) return res.status(401).json({ message: "No hay token" });

      const userFound = await pool.query(
        `SELECT auth.qry_auth(operacion => $1, id_usuario_param => $2)`,
        [1, user.id]
      );
      if (!userFound) return res.sendStatus(401);

      return res.json(token);
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const logoutRequest = async (req, res) => {
  //obtener id de cierre
  const { id_inicio_session } = req.user;

  await pool.query(
    `SELECT auth.qry_auth(operacion => $1, fecha_cierre_param  => $2, hora_cierre_param => $3, id_param => $4)`,
    [
      5,
      new Date().toISOString().slice(0, 10),
      new Date().toTimeString().slice(0, 8),
      id_inicio_session,
    ]
  );

  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const loginRequest = async (req, res) => {
  try {
    //obtener datos del req body
    const { email, password } = req.body;

    //validar existencia del usuario por email
    const results = await pool.query(
      `SELECT auth.qry_auth(operacion => $1, email_param => $2)`,
      [4, email]
    );
    if (results.rows[0].qry_auth == 0 || results.rows[0].qry_auth == null) {
      return res.status(400).json({ message: "Error de credenciales" });
    }

    //validar estado de la escuela a la que pertenece el usuario
    const resultsSchool = await pool.query(
      `SELECT configuracion.qry_escuelas(operacion => $1, id_registro => $2)`,
      [7, results.rows[0].qry_auth[0].id_escuela]
    );

    if (resultsSchool.rows[0].qry_escuelas[0].is_active == false) {
      return res.status(400).json({message : "Error de credenciales"})
    }

    //validar estado del usuario
    if (results.rows[0].qry_auth[0].activo == false) {
      return res.status(400).json({message : "Error de credenciales"})
    }

    //validar contraseña y hash
    const isMatch = await bcrypt.compare(
      password,
      results.rows[0].qry_auth[0].password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Error de credenciales" });
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // insertar registro inicio de session
    const insert_session = await pool.query(
      `SELECT auth.qry_auth (operacion => $1, id_usuario_param => $2, fecha_inicio_param => $3, hora_inicio_param => $4, fecha_cierre_param => $5, hora_cierre_param => $6, ip_maquina_param => $7)`,
      [
        3,
        results.rows[0].qry_auth[0].id,
        new Date().toISOString().slice(0, 10),
        new Date().toTimeString().slice(0, 8),
        null,
        null,
        ip,
      ]
    );

    const id_inicio_session = insert_session.rows[0].qry_auth.id;

    //inicar session del usuario
    const token = await createAccessToken({
      id: results.rows[0].qry_auth[0].id,
      email: email,
      id_rol: results.rows[0].qry_auth[0].id_rol,
      id_escuela: results.rows[0].qry_auth[0].id_escuela,
      id_tipo_usuario: results.rows[0].qry_auth[0].id_tipo_usuario,
      imagen_profile: results.rows[0].qry_auth[0].image_profile,
      id_tercero: results.rows[0].qry_auth[0].id_tercero,
      nombre_usuario:
        results.rows[0].qry_auth[0].primer_nombre +
        " " +
        results.rows[0].qry_auth[0].primer_apellido,
      id_tipo_licencia: results.rows[0].qry_auth[0].id_tipo_licencia,
      fecha_exp: results.rows[0].qry_auth[0].fecha_expiracion_licencia,
      id_inicio_session: id_inicio_session,
    });

    res.cookie("token", token);

    res.json(token);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
