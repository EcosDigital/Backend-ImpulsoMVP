import { Router } from "express";
import { authRequired } from '../../middlewares/validateToken.js'
import { chatRequest } from '../../controllers/ia/chat.controller.js'


const router = Router();

router.post("/chat/:id_escuela", chatRequest )

export default router;
