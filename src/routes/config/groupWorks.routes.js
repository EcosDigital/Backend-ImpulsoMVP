import { Router } from "express";

import { authRequiredEdu, authRequiredWithRoleShared } from "../../middlewares/validateToken.js";
import { validateSchema } from "../../middlewares/validator.middlewares.js";

import { regsterGrupoSchema } from "../../schema/config/groupWorks.schema.js";

import {
  getTipoPruebaRequest,
  getGrupoRecentRequest,
  registerGrupoRequest,
  updateGrupoTrabajoRequest,
  addAlumnoToGrupoRequest,
  getAlumnosForGrupoRequest,
  deleteAlumnosForGrupoRequest,
  getGrupoTrabajoRequest,
} from "../../controllers/config/groupWorks.js";

const router = Router();

router.get(
  "/getGruposRecents",
  authRequiredEdu,
  getGrupoRecentRequest
);

router.post(
  "/createGrupoTrabajo",
  authRequiredEdu,
  validateSchema(regsterGrupoSchema),
  registerGrupoRequest
);

router.get("/getTipoPrueba", authRequiredEdu, getTipoPruebaRequest);

router.get("/getGrupoTrabajo/:id", authRequiredEdu, getGrupoTrabajoRequest)

router.put(
  "/updateGrupoTrabajo/:id",
  authRequiredEdu,
  validateSchema(regsterGrupoSchema),
  updateGrupoTrabajoRequest
);

router.post("/addAlumnoToGrupo/:id_grupo", authRequiredEdu, addAlumnoToGrupoRequest)

router.get("/getAlumnosForGrupo/:id_grupo", authRequiredEdu, getAlumnosForGrupoRequest)

router.delete("/deleteAlumnosForGrupo/:id", authRequiredEdu, deleteAlumnosForGrupoRequest)

export default router;
