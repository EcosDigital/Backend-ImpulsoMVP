import z from "zod";

export const registerTicketSchema = z.object({
  id_tipo: z
    .number()
    .int("Debe ser un numero entero.")
    .positive("debe ser un numero positivo"),
  id_prioridad: z
    .number()
    .int("Debe ser un numero entero")
    .positive("debe ser un numero positivo"),
  id_estado: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  titulo: z
    .string()
    .min(5, "La direccion institucional debe tener al menos 5 caracteres")
    .max(150, "La direccion es demasiado larga"),
  descripcion: z
    .string()
    .min(5, "La direccion institucional debe tener al menos 5 caracteres"),
});
