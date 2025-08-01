import {Router} from 'express'

import generalRoutes from './routes/general.routes.js'
import uploadRoutes from './routes/config/upload.routes.js'
import SchoolRoutes from './routes/config/schoorl.routes.js'
import TercerosRoutes from './routes/config/terceros.routes.js'
import userRoutes from './routes/auth/user.routes.js'
import UsuariosRoutes from './routes/auth/usuarios.routes.js'

//rutas del modulo soporte
import soporteRoutes from './routes/soporte/tickets.routes.js'

import PreguntasRoutes from './routes/academico/preguntas.routes.js'
import QuizRoutes from './routes/academico/quiz.routes.js'

import GroupWorksRoutes from './routes/config/groupWorks.routes.js'
import PuntuacionesRoutes from './routes/academico/puntuaciones.routes.js'

import BootRoutes from './routes/IA/boot.routes.js'

//rutas para el area de modular (modulos)
import ModulRoutes from './routes/config/modulos.routes.js'

const router = Router()

//rutas generales
router.use("/api", generalRoutes)
router.use("/api", userRoutes) //rutas de authenticated
//rutas del modulo school
router.use("/api", SchoolRoutes)
//rutas del modulo terceros
router.use("/api", TercerosRoutes)
//rutas del modulo de usuarios
router.use("/api", UsuariosRoutes)
//rutas del modulo de preguntas
router.use("/api", PreguntasRoutes)
//rutas de registro de resultados del quiz
router.use("/api", QuizRoutes)
router.use("/api", GroupWorksRoutes) // rutas del modulo (grupos de trabajo)
router.use("/api", PuntuacionesRoutes) // rutas del modulo de clasificacion por puntos
//rutas para el modulo de uploads (archivos csv pedf e imagenes)
router.use("/api", uploadRoutes)
router.use("/api", ModulRoutes)
router.use("/api", BootRoutes)
router.use("/api", soporteRoutes)


export default router