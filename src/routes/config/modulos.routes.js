import { Router } from "express";
import { getListAreaTrabajoRquest } from "../../controllers/config/modulos.js";
import { authRequiredWithRoleSuperAdmin } from "../../middlewares/validateToken.js";

const router = Router();

router.get("/getListAreaTrabajo", authRequiredWithRoleSuperAdmin, getListAreaTrabajoRquest)

export default router;
