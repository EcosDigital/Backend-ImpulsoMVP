import z from "zod";

export const regsterGrupoSchema = z.object({
    nombre_grupo: z.string().min(3, "El nombre debe tener almenos 3 caracteres"),
    id_tipo_prueba_icfes: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser un número positivo"),
  id_director_grupo: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser un número positivo"),
    is_active: z.boolean(),
});
