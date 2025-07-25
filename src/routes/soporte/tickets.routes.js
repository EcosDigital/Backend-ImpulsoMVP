import { Router } from "express";

import { validateSchema } from "../../middlewares/validator.middlewares.js";
import { registerTicketSchema } from "../../schema/soporte/ticket.schema.js";

import {
  authRequired,
  authRequiredWithRoleSuperAdmin,
} from "../../middlewares/validateToken.js";
import {
  assignedTicketRequest,
  gestionTicketRequest,
  getStatsTicketRequest,
  getTicketByStatusRequest,
  registerTicketRequest,
} from "../../controllers/soporte/ticket.controllers.js";

const router = Router();

//registrar ticket
router.post(
  "/registerTicket",
  authRequired,
  validateSchema(registerTicketSchema),
  registerTicketRequest
);

//stats Tickets
router.get("/getStatsTickets", authRequired, getStatsTicketRequest);

//Buscar tikets activos
router.get("/getTicketsByEstado", authRequired, getTicketByStatusRequest);

//asignacion ticket
router.post(
  "/assignedTicket",
  authRequiredWithRoleSuperAdmin,
  assignedTicketRequest
);

//getion ticket
router.post("/gestionTicket/:id", authRequired, gestionTicketRequest);

export default router;
