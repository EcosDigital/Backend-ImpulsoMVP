import  { Router } from "express"

import { authRequired } from '../../middlewares/validateToken.js'
import { getClasificacionEscolarRequest, getClasificacionGrupalRequest, getRankinForAreaRequest } from "../../controllers/academico/puntuacion.js"

const router = Router()

router.get("/getClasificacionEscolar", authRequired, getClasificacionEscolarRequest)

router.get("/getClasificacionGrupal/:id_grupo", authRequired, getClasificacionGrupalRequest)

/**DEFINIR LAS RUTAS DE CLASIFICACION POR PUNTOS SEGUN EL AREA */

router.post("/getRankinForArea", authRequired, getRankinForAreaRequest)

export default router