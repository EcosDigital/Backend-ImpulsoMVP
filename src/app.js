import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from "cookie-parser";
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';

import { checkConnection } from './config/db.js'

import routes from './routes.js'
import { FRONTEND_URL } from './config/config.js'

//inicializacion del servidor
const app = express()
checkConnection() //verificar conexion BD

// Construir __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para almacenar en la carpeta 'uploads'
multer({ dest: path.join(__dirname, '../uploads/') });
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); //carpeta pubica

//configuracion de cors
app.use(
    cors({
      credentials: true,
      origin: FRONTEND_URL,
    })
  );

//visualizar las peticiones del servidor por consola
app.use(morgan("dev"))
app.use(express.json()) //habilita soporte JSON
app.use(cookieParser()) // cookies de login

app.use(routes)


export default app