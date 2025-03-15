import { Router } from 'express'

import {authRequiredWithRoleShared} from '../../middlewares/validateToken.js'

import { createUserRequest, getDataUsuarioRequest, getHistorialSigninRequest, getInfoTerceroRequest, getListTipoUserRequest, getTipoEstadoUserRequest, getUserForTerceroRequest, getUserRecentsRequest, updatePasswordUserRequest, updateUserRequest } from '../../controllers/auth/usuarios.js'

const router = Router()

router.get("/getUserRecents", authRequiredWithRoleShared, getUserRecentsRequest)

router.get("/getListTipoUser", authRequiredWithRoleShared, getListTipoUserRequest)

router.get("/getEstadoUser", authRequiredWithRoleShared, getTipoEstadoUserRequest)

router.get("/getUserForTercero/:id", authRequiredWithRoleShared, getUserForTerceroRequest)

router.get("/getInfoTercero/:id", authRequiredWithRoleShared, getInfoTerceroRequest)

router.post("/createNewUser", authRequiredWithRoleShared, createUserRequest)

router.get(`/getDataUser/:id`, authRequiredWithRoleShared, getDataUsuarioRequest)

router.put(`/updateUser/:id`, authRequiredWithRoleShared, updateUserRequest)

router.put(`/updatePasswordUser/:id`, authRequiredWithRoleShared, updatePasswordUserRequest)

router.get("/getHistorialSignin/:id", authRequiredWithRoleShared, getHistorialSigninRequest)

export default router