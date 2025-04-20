import { Router } from "express";
import { authRequired } from '../../middlewares/validateToken.js'
import { chatRequest } from '../../controllers/ia/chat.controller.js'


const router = Router();

router.post("/chat/:id_escuela", chatRequest )

/*const API_KEY = "AIzaSyAidFrZxabzuLHQyphWBIv8UotQ3_OHj2E";
*/

export default router;
