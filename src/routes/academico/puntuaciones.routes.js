import  { Router } from "express"

import { authRequired } from '../../middlewares/validateToken.js'
import { getClasificacionEscolarRequest, getClasificacionGrupalRequest } from "../../controllers/academico/puntuacion.js"

const router = Router()

router.get("/getClasificacionEscolar", authRequired, getClasificacionEscolarRequest)

router.get("/getClasificacionGrupal/:id_grupo", authRequired, getClasificacionGrupalRequest)

export default router