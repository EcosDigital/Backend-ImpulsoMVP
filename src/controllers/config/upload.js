import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import csvParser from "csv-parser";
import bcrypt from "bcryptjs";

import { pool } from "../../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../../uploads/csv"); // Ruta donde se guardarán las imágenes
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Crea el directorio si no existe
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname); // Obtiene la extensión original del archivo

    // Si no hay extensión, asignamos .webp por defecto
    if (!ext) {
      ext = ".csv";
    }

    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName); // Nombre único con la extensión correspondiente
  },
});

const upload = multer({ storage }).array("data", 1); // Máximo 1 archivo

export const uploadDepartamentoRequest = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar archivos:", err);
      return res.status(500).json({ message: "Error al procesar archivos" });
    }

    try {
      const data = req.files;

      if (!data || data.length === 0) {
        return res.status(400).json({ message: "No se recibieron archivos." });
      }

      const file = data[0];
      if (path.extname(file.originalname) !== ".csv") {
        return res
          .status(400)
          .json({ message: "El archivo no es un archivo CSV válido." });
      }

      const rows = [];
      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on("data", (row) => {
          rows.push(row);
        })
        .on("end", async () => {
          // Ignorar el encabezado (primer elemento en el archivo CSV)
          rows.shift();

          //insertar registros en la base de datos
          try {
            for (const row of rows) {
              const query = `INSERT INTO configuracion.ref_departamento
              (codigo, nombre) VALUES($1, $2)`;

              const values = [row.CODIGO_DEPARTAMENTO, row.NOMBRE_DEPARTAMENTO];

              await pool.query(query, values);
            }

            return res
              .status(200)
              .json({ message: "Proceso finalizado exitosamente!" });
          } catch (error) {
            return res.status(500).json({
              message: "Error al insertar los datos en la base de datos",
              error: error.message,
            });
          }
        });
    } catch (error) {
      return res.status(500).json({
        message: "Error al procesar el archivo",
        error: error.message,
      });
    }
  });
};

export const uploadMunicipiosRequest = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error al procesar archivos:", err);
        return res.status(500).json({ message: "Error al procesar archivos" });
      }

      try {
        const data = req.files;

        if (!data || data.length === 0) {
          return res
            .status(400)
            .json({ message: "No se recibieron archivos." });
        }

        const file = data[0];
        if (path.extname(file.originalname) !== ".csv") {
          return res
            .status(400)
            .json({ message: "El archivo no es un archivo CSV válido." });
        }

        const rows = [];
        fs.createReadStream(file.path)
          .pipe(csvParser())
          .on("data", (row) => {
            rows.push(row);
          })
          .on("end", async () => {
            // Ignorar el encabezado (primer elemento en el archivo CSV)
            rows.shift();

            //insertar registros en la base de datos
            try {
              for (const row of rows) {
                const query = `INSERT INTO configuracion.ref_municipios
                (codigo_departamento, codigo_municipio, nombre_municipio) VALUES($1, $2, $3)`;

                const values = [
                  parseInt(row.codigo_departamento, 10),
                  parseInt(row.codigo_municipio, 10),
                  row.nombre,
                ];

                //return res.status(200).json(values);
                await pool.query(query, values);
              }

              return res
                .status(200)
                .json({ message: "Proceso finalizado exitosamente!" });
            } catch (error) {
              return res.status(500).json({
                message: "Error al insertar los datos en la base de datos",
                error: error.message,
              });
            }
          });
      } catch (error) {
        return res.status(500).json({
          message: "Error al procesar el archivo",
          error: error.message,
        });
      }
    });
  } catch (error) {}
};

//controlador para subir preguntas y respuestas masivamente
export const uploadPreguntasRespuestasRequest = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al procesar archivos:", err);
      return res.status(500).json({ message: "Error al procesar archivos" });
    }

    try {
      const data = req.files;

      if (!data || data.length === 0) {
        return res.status(400).json({ message: "No se recibieron archivos." });
      }

      const file = data[0];
      if (path.extname(file.originalname) !== ".csv") {
        return res
          .status(400)
          .json({ message: "El archivo no es un archivo CSV válido." });
      }

      const rows = [];
      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on("data", (row) => {
          rows.push(row);
        })
        .on("end", async () => {
          //ignorar el encabezado (primer elemento del archivo csv)
          //rows.shift();

          //insertar registro de la pregunta
          try {
            for (const row of rows) {
              const query = `INSERT INTO educacion.cfg_preguntas(texto_apoyo, ilustracion_apoyo, texto_pregunta, id_area, id_nivel, tiempo_estimado, id_usuario, fecha_creacion, is_active, ia, texto_pista, texto_explicacion, periodo_referencia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id `;

              let jsonText = JSON.stringify({ parrafo: row.TEXTO_APOYO }) || "";

              const id_area =
                row.AREA === "Lectura Crítica"
                  ? 1
                  : row.AREA === "Matemáticas"
                  ? 2
                  : row.AREA === "Ciencias Naturales"
                  ? 3
                  : row.AREA === "Sociales y Ciudadanas"
                  ? 4
                  : row.AREA === "Inglés"
                  ? 5
                  : 0;

              const id_nivel =
                row.NIVEL === "Fácil"
                  ? 1
                  : row.NIVEL === "Medio"
                  ? 2
                  : row.NIVEL === "Alto"
                  ? 3
                  : 0;

              const values = [
                jsonText,
                row.ILUSTRACION_APOYO,
                row.TEXTO_PREGUNTA,
                id_area,
                id_nivel,
                row.TIEMPO_ESTIMADO,
                req.user.id,
                new Date(),
                row.ACTIVO,
                row.IA,
                row.TEXTO_PISTA,
                row.TEXTO_EXPLICACION,
                parseInt(row.FECHA_CUADERNILLO, 10),
              ];

              const results = await pool.query(query, values);
              const id_registro = results.rows[0].id;

              //constrir json de respuestas
              const response = [
                {
                  texto_respuesta: row.RESPUESTA_A,
                  es_correcta: row.CORRECTA == 1 ? true : false,
                },
                {
                  texto_respuesta: row.RESPUESTA_B,
                  es_correcta: row.CORRECTA == 2 ? true : false,
                },
                {
                  texto_respuesta: row.RESPUESTA_C,
                  es_correcta: row.CORRECTA == 3 ? true : false,
                },
                {
                  texto_respuesta: row.RESPUESTA_D,
                  es_correcta: row.CORRECTA == 4 ? true : false,
                },
              ];

              //Recorrer el array para insertar respuestas
              for (const item of response) {
                await pool.query(
                  `INSERT INTO educacion.cfg_respuestas(id_pregunta, texto_respuesta, es_correcta) VALUES ($1, $2, $3)`,
                  [id_registro, item.texto_respuesta, item.es_correcta]
                );
              }
            }

            return res
              .status(200)
              .json({ message: "Procesos realizado exitosamente!" });
            //return res.status(200).json(response)
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Error al procesar el archivo",
        error: error.message,
      });
    }
  });
};

//controlador para subir usuarios de forma masiva
export const uploadUsuariosRequest = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error al procesar los archivos." });
    }
    try {
      const data = req.files;
      if (!data || data.length === 0) {
        return res.status(400).json({ message: "No se recibieron archivos." });
      }

      const file = data[0];
      if (path.extname(file.originalname) !== ".csv") {
        return res
          .status(400)
          .json({ message: "El archivo no es un archivo CSV válido." });
      }

      //Consultar region y municipio de la escuela
      const results = await pool.query(
        `SELECT id_departamento, id_ciudad from configuracion.cfg_escuelas where id = $1`,
        [req.user.id_escuela]
      );

      const id_ciudad = results.rows[0].id_ciudad;
      const id_departamento = results.rows[0].id_departamento;

      const rows = [];
      fs.createReadStream(file.path)
        .pipe(csvParser())
        .on("data", (row) => {
          rows.push(row);
        })
        .on("end", async () => {
          //insertar registro
          try {
            for (const row of rows) {
              //verificar la exitencia del tercero (informacion personal)
              const validateTercero = await pool.query(
                `SELECT configuracion.qry_terceros(operacion => $1, numero_documento_p => $2, id_escuela_p => $3)`,
                [1, row.NUMERO_DOCUMENTO, req.user.id_escuela]
              );

              if (
                validateTercero.rows[0].qry_terceros != null ||
                validateTercero.rows[0].qry_terceros > 0
              ) {
                continue;
              }

              const id_tipo_documento =
                row.TIPO_DOCUMENTO === "Tarjeta de indentidad"
                  ? 1
                  : row.TIPO_DOCUMENTO === "cédula de ciudadania"
                  ? 2
                  : 0;

              const id_genero =
                row.GENERO === "Masculino"
                  ? 1
                  : row.GENERO === "Femenino"
                  ? 2
                  : 0;

              const es_alumno =
                row.ES_ALUMNO === "Sí"
                  ? true
                  : row.ES_ALUMNO === "No"
                  ? false
                  : false;

              const es_docente =
                row.ES_DOCENTE === "Sí"
                  ? true
                  : row.ES_DOCENTE === "No"
                  ? false
                  : false;

              const es_directivo =
                row.ES_DIRECTIVO === "Sí"
                  ? true
                  : row.ES_DIRECTIVO === "No"
                  ? false
                  : false;

              //crear tercero
              const insert_tercero = await pool.query(
                `SELECT configuracion.qry_terceros(operacion => $1, id_usuario_p => $2, id_escuela_p => $3, id_tipo_documento_p => $4, numero_documento_p => $5, fecha_nacimiento_p => $6, phone => $7, direccion_p => $8, id_genero_p => $9, alumno => $10, docente => $11, directivo => $12, primer_nombre_p => $13, segundo_nombre_p => $14, primer_apellido_p => $15, segundo_apellido_p => $16, id_dpto => $17, id_city => $18, email_p => $19)`,
                [
                  2,
                  req.user.id,
                  req.user.id_escuela,
                  id_tipo_documento,
                  row.NUMERO_DOCUMENTO,
                  row.FECHA_NACIMIENTO,
                  row.TELEFONO,
                  row.DIRECCION,
                  id_genero,
                  es_alumno,
                  es_docente,
                  es_directivo,
                  row.PRIMER_NOMBRE,
                  row.SEGUNDO_NOMBRE,
                  row.PRIMER_APELLIDO,
                  row.SEGUNDO_APELLIDO,
                  id_departamento,
                  id_ciudad,
                  row.EMAIL,
                ]
              );

              const id_registro_tercero =
                insert_tercero.rows[0].qry_terceros.id;

              //hasheo de contraseña
              const passwordHash = await bcrypt.hash(row.NUMERO_DOCUMENTO, 10);

              const id_rol =
                row.ROL_USUARIO === "Administrador"
                  ? 2
                  : row.ROL_USUARIO === "Educador"
                  ? 3
                  : row.ROL_USUARIO === "Aprendiz"
                  ? 4
                  : 0;

              //registro de usuario
              await pool.query(
                `SELECT configuracion.qry_usuarios(operacion => $1, email_param => $2, password_param => $3, id_rol_param => $4, id_escuela_p => $5, id_tercero_param => $6, id_tipo_usuario_param => $7, id_tipo_licencia_param => $8, fecha_act_licencia => $9, fecha_exp_licencia => $10, img_profile => $11, activo_param => $12, id_estado_param => $13 )`,
                [
                  2,
                  row.EMAIL,
                  passwordHash,
                  id_rol,
                  req.user.id_escuela,
                  id_registro_tercero,
                  1,
                  6,
                  new Date(),
                  req.user.fecha_exp,
                  "",
                  true,
                  1,
                ]
              );

              res.status(200).json({message : "Proceso realizado exitosamente..."})

            }
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Error al procesar el archivo",
        error: error.message,
      });
    }
  });
};
