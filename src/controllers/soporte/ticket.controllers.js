import { pool } from "../../config/db.js";

export const registerTicketRequest = async (req, res) => {
  //datos del req body
  try {
    const { id_tipo, id_prioridad, id_estado, titulo, descripcion } = req.body;

    //registrar ticket
    const results = await pool.query(
      `SELECT soporte.qry_tickets(operacion => $1, id_escuela_p => $2, id_usuario_p => $3, id_tipo_p => $4, id_prioridad_p => $5, id_estado_p => $6, titulo => $7, descripcion => $8
      )`,
      [
        1,
        req.user.id_escuela,
        req.user.id,
        id_tipo,
        id_prioridad,
        id_estado,
        titulo,
        descripcion,
      ]
    );

    const id_ticket = results.rows[0].qry_tickets.id;

    return res
      .status(200)
      .json({ message: "Registro almacenado correctamente", id: id_ticket });
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const getStatsTicketRequest = async (req, res) => {
  try {
    const results = await pool.query(`SELECT soporte.qry_tickets(operacion => $1)`, [2])
    return res.status(200).json(results.rows[0].qry_tickets)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
}

export const getTicketByStatusRequest = async (req, res) => {
  try {
    const { id_estado } = req.query
    
    //uscar tickets en estado activo
    const results = await pool.query(
      `SELECT soporte.qry_tickets(operacion => $1, id_estado_p => $2)`,
      [3, id_estado]
    );
    return res.status(200).json(results.rows[0].qry_tickets);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const assignedTicketRequest = async (req, res) => {};

export const gestionTicketRequest = async (req, res) => {
  //datos del req body
};
