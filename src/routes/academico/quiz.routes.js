import {Router} from 'express'

import { authRequired } from '../../middlewares/validateToken.js'

import { registerResultadoQuiz } from '../../controllers/academico/quiz.js'

const router = Router()

router.post("/registerResultadosQuiz", authRequired, registerResultadoQuiz)

export default router