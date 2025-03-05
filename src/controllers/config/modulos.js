import { pool } from '../../config/db.js'

export const getListAreaTrabajoRquest = async (req, res) => {
    try {
        const results = await pool.query(`SELECT configuracion.qry_modulos(operacion => $1)`, [1])
        return res.status(200).json(results.rows[0].qry_modulos)
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message: 'Error inesperado!'})
    }
}