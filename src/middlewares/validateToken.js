import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";

export const authRequired = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No hay token, autorizacion denegada" });

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(500).json({ message: "Token no valido" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const authRequiredWithRoleSuperAdmin = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No hay token, autorizacion denegada" });

        jwt.verify(token, TOKEN_SECRET, (error, user) => {
            if(error){
                return res.status(500).json({message: "Token no valido"})
            }
            if(user.id_rol != 1){
                return res.status(500).json({message: "No cuenta con autorizacion"})
            }
            
            req.user = user;
            next()
        })

  } catch (error) {}
};

export const authRequiredWithRoleShared = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No hay token, autorizacion denegada" });

        jwt.verify(token, TOKEN_SECRET, (error, user) => {
            if(error){
                return res.status(500).json({message: "Token no valido"})
            }
            if (user.id_rol !== 1 && user.id_rol !== 2) {
                return res.status(500).json({message: "No cuenta con autorizacion"})
            }
            
            req.user = user;
            next()
        })

  } catch (error) {}
}

export const authRequiredEdu = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No hay token, autorizacion denegada" });

        jwt.verify(token, TOKEN_SECRET, (error, user) => {
            if(error){
                return res.status(500).json({message: "Token no valido"})
            }
            if (user.id_rol == 4) {
                return res.status(500).json({message: "No cuenta con autorizacion"})
            }
            
            req.user = user;
            next()
        })

  } catch (error) {}
}
