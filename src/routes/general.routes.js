import { Router } from "express";

import { authRequired, authRequiredEdu, authRequiredWithRoleShared } from '../middlewares/validateToken.js'

import {
  getAllLicenciaSchoolRequest,
  getDepartamentosRequest,
  getEstadosTicketRequest,
  getGeneroRequest,
  getLicenciasSchoolRequest,
  getMunicipiosRequest,
  getProridadTicketRequest,
  getRangoDocentesRequest,
  getRangoEstudiantesRequest,
  getRolUserRequest,
  getTipoDocumentoRequest,
  getTipoInstitucionRequest,
  getTipoTicketRequest,
  searchDynamicsRequest,
} from "../controllers/general.js";

const router = Router();

router.get("/getTipoInstitucion", getTipoInstitucionRequest);

router.get("/getDepartamentos", getDepartamentosRequest);

router.get("/getMunicipios/:id", getMunicipiosRequest);

router.get("/getRangoEstudiantes", getRangoEstudiantesRequest);

router.get("/getRangoDocentes", getRangoDocentesRequest);

router.get("/getTipoDocumento", getTipoDocumentoRequest)

router.get("/getGeneros", getGeneroRequest)

router.get("/getLicenciaSchool/:id_rango_estudiantes", getLicenciasSchoolRequest)

router.get("/getAllLicenciaSchool", getAllLicenciaSchoolRequest)

router.post("/searchDynamics", authRequiredWithRoleShared, searchDynamicsRequest)

router.get("/getRolUser", authRequiredWithRoleShared, getRolUserRequest)

/*seccion de modulo soporte TICKETS */
router.get("/getEstadosTicket", authRequired, getEstadosTicketRequest)

router.get("/getTipoTicket", authRequired, getTipoTicketRequest)

router.get("/getPrioridadTicket", authRequired, getProridadTicketRequest)

export default router;
