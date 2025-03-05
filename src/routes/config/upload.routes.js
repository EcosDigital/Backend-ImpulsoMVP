import { Router } from "express";

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
  uploadPreguntasRespuestasRequest
);

export default router;
