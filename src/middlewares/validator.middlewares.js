export const validateSchema = (schema) => (req, res, next) => {
    try {
      // Valida el cuerpo de la solicitud
      schema.parse(req.body);
      next(); // Continúa al siguiente middleware o controlador si la validación pasa
    } catch (error) {
      if (error.errors) {
        // Mapea los errores de Zod a un formato más detallado
        const formattedErrors = error.errors.map((err) => ({
          field: err.path[0], // Campo con el error
          message: err.message, // Mensaje detallado de Zod
        }));
  
        // Devuelve una respuesta 400 con los errores detallados
        return res.status(400).json({ errors: formattedErrors });
      }
  
      // Devuelve un error genérico si ocurre algo inesperado
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  