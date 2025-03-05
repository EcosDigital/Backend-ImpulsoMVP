import app from './app.js'
import { BACKEND_PORT } from './config/config.js'
//puerto de escucha en el servidor
app.listen(BACKEND_PORT)
console.log('Servidor Activo En El Puerto', BACKEND_PORT);

