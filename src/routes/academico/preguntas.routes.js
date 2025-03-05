import { Router } from "express";

import { authRequiredEdu, authRequired } from "../../middlewares/validateToken.js";
import {
  getAreaEstudioRequest,
  getNivelDificultadRequest,
  getPreguntasForQuizRequest,
  registerPreguntaRequest,
} from "../../controllers/academico/preguntas.js";

const router = Router();

router.get("/getAreaEstudio", authRequired, getAreaEstudioRequest);

router.get("/getNivelDificultad", authRequired, getNivelDificultadRequest)

router.post("/registerPregunta", authRequiredEdu, registerPreguntaRequest);

router.post("/getPreguntasForQuiz", authRequired, getPreguntasForQuizRequest)

export default router;
