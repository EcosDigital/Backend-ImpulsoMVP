import pg from "pg";

import { DB_USER, DB_HOST, DB_PASS, DB_NAME, DB_PORT } from "./config.js";

export const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT,
});

// Verificar conexión exitosa o errores
export const checkConnection = async () => {
  try {
    // Intentar conectarse a la base de datos
    const client = await pool.connect();
    console.log(">>> Conexión a la base de datos exitosa");
    client.release(); // Libera el cliente después de usarlo
  } catch (err) {
    console.error("Error al conectarse a la base de datos:", err.stack);
  }
};
