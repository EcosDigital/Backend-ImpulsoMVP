import { Router } from "express";

import {
  authRequiredEdu,
  authRequiredWithRoleShared,
} from "../../middlewares/validateToken.js";

import {
  uploadDepartamentoRequest,
  uploadMunicipiosRequest,
  uploadPreguntasRespuestasRequest,
  uploadUsuariosRequest,
} from "../../controllers/config/upload.js";

import { uploadImageRequest } from "../../controllers/config/uploadImage.js";

const router = Router();

router.post("/uploadDepartamento", uploadDepartamentoRequest);

router.post("/uploadMunicipio", uploadMunicipiosRequest);

router.post("/uploadImage", uploadImageRequest);

router.post(
  "/uploadPreguntasResponses",
  authRequiredEdu,
  uploadPreguntasRespuestasRequest
);

router.post("/uploadUsuarios", authRequiredWithRoleShared, uploadUsuariosRequest);

export default router;
