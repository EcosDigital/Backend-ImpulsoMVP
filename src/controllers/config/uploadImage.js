import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../../../uploads/images");

// Crear la carpeta de almacenamiento si no existe
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Configuración de almacenamiento para multer (archivos temporales)
const storage = multer.memoryStorage(); // Guardamos en memoria para procesarlos con Sharp
const upload = multer({ storage }).array("media", 1);

// Promisificar la subida de archivos
const uploadMiddleware = (req, res) =>
  new Promise((resolve, reject) => {
    upload(req, res, (err) => (err ? reject(err) : resolve(req.files)));
  });

// Función para procesar y comprimir imágenes con Sharp
const processImage = async (fileBuffer, filename) => {
  const outputPath = path.join(UPLOADS_DIR, filename);

  await sharp(fileBuffer)
    .resize({ width: 1000 }) // Redimensiona la imagen si es demasiado grande (ajusta según necesidades)
    .webp({ quality: 80 }) // Convierte a webp con 80% de calidad
    .toFile(outputPath);

  return `/uploads/${filename}`;
};

// Controlador optimizado con compresión y conversión
export const uploadImageRequest = async (req, res) => {
  try {
    const media = await uploadMiddleware(req, res);

    if (!media || media.length === 0) {
      return res.status(400).json({ message: "No se recibieron archivos." });
    }

    // Procesar todas las imágenes
    const filePaths = await Promise.all(
      media.map(async (file) => {
        const uniqueName = `${Date.now()}-${Math.floor(
          Math.random() * 1e6
        )}.webp`;
        const storedPath = await processImage(file.buffer, uniqueName);
        return { originalName: uniqueName, storedPath };
      })
    );

    return res.status(200).json({
      message: "Archivos subidos y comprimidos con éxito.",
      files: filePaths,
    });
  } catch (error) {
    console.error("Error al procesar archivos:", error);
    return res.status(500).json({ message: "Error al procesar archivos." });
  }
};

