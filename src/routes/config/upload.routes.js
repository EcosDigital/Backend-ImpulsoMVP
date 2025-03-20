import { Router } from "express";

import { authRequiredEdu } from '../../middlewares/validateToken.js'

import {
  uploadDepartamentoRequest,
  uploadMunicipiosRequest,
  uploadPreguntasRespuestasRequest
} from "../../controllers/config/upload.js";

import {
  uploadImageRequest,
} from "../../controllers/config/uploadImage.js";

const router = Router();

router.post("/uploadDepartamento", uploadDepartamentoRequest);

router.post("/uploadMunicipio", uploadMunicipiosRequest);

router.post("/uploadImage", uploadImageRequest);

router.post(
  "/uploadPreguntasResponses",
  authRequiredEdu,
  uploadPreguntasRespuestasRequest
);

export default router;
