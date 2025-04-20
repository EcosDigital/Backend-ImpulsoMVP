import { Router } from "express";

import { validateSchema } from "../../middlewares/validator.middlewares.js";
import {
  registerSchoolSchema,
  updateSchoolSchema,
} from "../../schema/config/school.schema.js";

import {
  authRequired,
  authRequiredWithRoleSuperAdmin,
} from "../../middlewares/validateToken.js";

import {
  getListSchoolRequest,
  getSchoolRequest,
  registerSchoolRequest,
  UpdateLicenciaSchoolRequest,
  updateScholRequest,
} from "../../controllers/config/school.js";

const router = Router();

router.post(
  "/registerSchool",
  validateSchema(registerSchoolSchema),
  registerSchoolRequest
);

router.post("/updateLicenciaSchool", UpdateLicenciaSchoolRequest);

router.get(
  "/getListSchool",
  authRequiredWithRoleSuperAdmin,
  getListSchoolRequest
);

router.get("/getSchool/:id", authRequiredWithRoleSuperAdmin, getSchoolRequest);

router.put(
  "/updateSchol/:id",
  authRequiredWithRoleSuperAdmin,
  updateScholRequest
);

export default router;
