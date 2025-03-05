import z from "zod";

export const registerTerceroSchema = z.object({
  id_tipo_documento: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser n numero positivo"),
  numero_documento: z
    .string()
    .min("El documento debe tener almenos 7 caracteres"),
  telefono: z
    .string()
    .min(7, "El telefono personal debe tener alemenos 7 caracteres")
    .max(15, "El telefono institucional es muy largo"),
  direccion: z
    .string()
    .min(5, "La direccion personal debe tener al menos 5 caracteres")
    .max(100, "La direccion es demasiado larga"),
  id_genero: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  es_alumno: z.boolean(),
  es_docente: z.boolean(),
  es_directivo: z.boolean(),
  primer_nombre: z
    .string()
    .min(3, "El nombre debe terner almenos 3 caracteres"),
  primer_apellido: z
    .string()
    .min(3, "El nombre debe terner almenos 3 caracteres"),
  id_departamento: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  id_ciudad: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  email_contacto: z
    .string()
    .email("El email no tiene un formato valido"),
});
