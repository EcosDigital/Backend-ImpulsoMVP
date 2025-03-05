import z from "zod";

// Esquema para validar que la fecha de nacimiento sea mayor de 18 años
const birthdateSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day)); // Asegura fecha correcta
  }
  return value;
}, z.date().refine((date) => {
  const today = new Date();
  let age = today.getFullYear() - date.getUTCFullYear();

  const monthDiff = today.getMonth() - date.getUTCMonth();
  const dayDiff = today.getDate() - date.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 18;
}, { message: "Debes ser mayor de 18 años" }));


const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/\d/, "Debe contener al menos un número")
  .regex(/[@$!%*?&]/, "Debe contener al menos un carácter especial (@$!%*?&)");

export const registerSchoolSchema = z.object({
  nombre_escuela: z
    .string()
    .min(3, "El nombre debe terner almenos 3 caracteres"),
  nit: z
    .string()
    .regex(
      /^\d{9,10}(-\d{1})?$/,
      "El NIT debe tener 9 o 10 dígitos, opcionalmente seguido de '-X'"
    ),
  direccion_escuela: z
    .string()
    .min(5, "La direccion institucional debe tener al menos 5 caracteres")
    .max(100, "La direccion es demasiado larga"),
  telefono_escuela: z
    .string()
    .min(7, "El telefono institucional debe tener alemenos 7 caracteres")
    .max(15, "El telefono institucional es muy largo"),
  correo_institucional: z
    .string()
    .email("El email instituconal no tiene un formato valido"),
  id_departamento_institucional: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  id_ciudad_institucional: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  id_rango_estudiantes: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  id_rango_docentes: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  representante_legal: z
    .string()
    .min(3, "El nombre debe terner almenos 3 caracteres"),
  id_tipo_documento: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
  numero_documento: z
    .string()
    .min(7, "El nombre debe terner almenos 7 caracteres"),
  primer_nombre: z
    .string()
    .min(3, "El nombre debe terner almenos 3 caracteres"),
  primer_apellido: z
    .string()
    .min(3, "El nombre debe terner almenos 3 caracteres"),
    id_departamento_tercero: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
    id_ciudad_tercero: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
    telefono_tercero: z
    .string()
    .min(7, "El telefono personal debe tener alemenos 7 caracteres")
    .max(15, "El telefono institucional es muy largo"),
    direccion_tercero: z
    .string()
    .min(5, "La direccion personal debe tener al menos 5 caracteres")
    .max(100, "La direccion es demasiado larga"),
    id_genero: z
    .number()
    .int("Debe ser un numero entero")
    .positive("Debe ser un numero positivo"),
    fecha_nacimiento: birthdateSchema,
    email_usuario: z
    .string()
    .email("El email instituconal no tiene un formato valido"),
    password: passwordSchema
});

export const updateSchoolSchema = z.object({
  
})
