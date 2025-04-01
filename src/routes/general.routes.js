import { Router } from "express";

import { authRequired, authRequiredEdu, authRequiredWithRoleShared } from '../middlewares/validateToken.js'

import {
  getAllLicenciaSchoolRequest,
  getDepartamentosRequest,
  getGeneroRequest,
  getLicenciasSchoolRequest,
  getMunicipiosRequest,
  getRangoDocentesRequest,
  getRangoEstudiantesRequest,
  getRolUserRequest,
  getTipoDocumentoRequest,
  getTipoInstitucionRequest,
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

export default router;
