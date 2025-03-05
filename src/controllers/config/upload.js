import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import csvParser from "csv-parser";

import { pool } from "../../config/db.js";
import { log } from "console";

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
              const query = `INSERT INTO educacion.cfg_preguntas(texto_apoyo, ilustracion_apoyo, texto_pregunta, id_area, id_nivel, tiempo_estimado, id_usuario, fecha_creacion, is_active, ia, texto_pista, texto_explicacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id `;

              let jsonText = JSON.stringify({ parrafo: row.TEXTO_APOYO }) || "" ;

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
                1,
                new Date(),
                row.ACTIVO,
                row.IA,
                row.TEXTO_PISTA,
                row.TEXTO_EXPLICACION,
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
