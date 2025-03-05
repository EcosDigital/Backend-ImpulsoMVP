import { Router } from "express";
import { validateSchema } from "../../middlewares/validator.middlewares.js";
import { registerTerceroSchema } from "../../schema/config/tercero.schema.js";

import {
  getRecentsTercerosRequest,
  getTerceroRequest,
  registerTerceroRequest,
  updateTerceroRequest,
} from "../../controllers/config/terceros.js";
import { authRequiredWithRoleShared } from "../../middlewares/validateToken.js";

const router = Router();

router.get(
  "/getRecentsTerceros",
  authRequiredWithRoleShared,
  getRecentsTercerosRequest
);

router.post(
  "/registerTercero",
  validateSchema(registerTerceroSchema),
  authRequiredWithRoleShared,
  registerTerceroRequest
);

router.get("/getTercero/:id", authRequiredWithRoleShared, getTerceroRequest)

router.put(
  "/updateTercero/:id",
  validateSchema(registerTerceroSchema),
  authRequiredWithRoleShared,
  updateTerceroRequest
);

export default router;
