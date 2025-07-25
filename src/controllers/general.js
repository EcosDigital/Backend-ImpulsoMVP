import { pool } from "../config/db.js";

export const getTipoInstitucionRequest = async (req, res) => {
  try {
    const ressults = await pool.query(
      `select * from configuracion.qry_generalidades(1)`
    );
    if (ressults.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultados..." });
    }
    return res.status(200).json(ressults.rows[0].qry_generalidades);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getDepartamentosRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `select * from configuracion.qry_generalidades(2)`
    );
    if (results.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultados..." });
    }
    return res.status(200).json(results.rows[0].qry_generalidades);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getMunicipiosRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const parametro = parseInt(id, 10);
    const results = await pool.query(
      `select * from configuracion.qry_generalidades(3, ${parametro})`
    );
    if (results.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultados..." });
    }
    return res.status(200).json(results.rows[0].qry_generalidades);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getRangoEstudiantesRequest = async (req, res) => {
  try {
    const ressults = await pool.query(
      `select * from configuracion.qry_generalidades(4)`
    );
    if (ressults.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultados..." });
    }
    return res.status(200).json(ressults.rows[0].qry_generalidades);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getRangoDocentesRequest = async (req, res) => {
  try {
    const ressults = await pool.query(
      `select * from configuracion.qry_generalidades(5)`
    );
    if (ressults.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultados..." });
    }
    return res.status(200).json(ressults.rows[0].qry_generalidades);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getTipoDocumentoRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `select * from configuracion.qry_generalidades(6)`
    );
    if (results.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultadoss..." });
    }
    return res.status(200).json(results.rows[0].qry_generalidades);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado" });
  }
};

export const getGeneroRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `select * from configuracion.qry_generalidades(7)`
    );
    const data = results.rows[0].qry_generalidades;
    if (data === 0 || data == null) {
      return res
        .status(404)
        .json({ message: "No se encontraron resultados..." });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado..." });
  }
};

export const getLicenciasSchoolRequest = async (req, res) => {
  try {
    //obtener el paametro de estudiantes
    const { id_rango_estudiantes } = req.params;
    let jsonData = [];
    //obtener la licencias gratuitas
    const licenciaFree = await pool.query(
      `SELECT * FROM configuracion.ref_tipo_licencia where id = 1`
    );
    const jsonFree = {
      id: licenciaFree.rows[0].id,
      name: licenciaFree.rows[0].nombre,
      description: licenciaFree.rows[0].descripcion,
      price: "Gratuito",
      period: "5 /Dias",
      type: "free",
    };
    jsonData.push(jsonFree);

    //obtener la licencia recomendada
    let licenciaId = 0;

    switch (id_rango_estudiantes) {
      case "1":
        licenciaId = 3;
        break;

      case "2":
        licenciaId = 4;
        break;

      case "3":
        licenciaId = 5;
        break;

      default:
        licenciaId = 0;
    }
    const licenciaRecomend = await pool.query(
      `select * from configuracion.ref_tipo_licencia where id = $1`,
      [licenciaId]
    );

    const jsonRecomend = {
      id: licenciaRecomend.rows[0].id,
      name: licenciaRecomend.rows[0].nombre,
      description: licenciaRecomend.rows[0].descripcion,
      price: licenciaRecomend.rows[0].precio_texto,
      period: "/Anual",
      type: "recommended",
      recommended: true,
    };
    jsonData.push(jsonRecomend);

    //obtener las opciones extras de licencia
    const licenciaExtra = await pool.query(
      `SELECT * FROM configuracion.ref_tipo_licencia 
       WHERE tipo_licencia = 2 AND id NOT IN ($1, $2, $3)`,
      [1, 2, licenciaId]
    );

    licenciaExtra.rows.forEach((row) => {
      jsonData.push({
        id: row.id,
        name: row.nombre,
        description: row.descripcion,
        price: row.precio_texto,
        type: "premium",
      });
    });

    return res.status(200).json(jsonData);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const getAllLicenciaSchoolRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `SELECT * FROM configuracion.ref_tipo_licencia where tipo_licencia = 2`
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado!" });
  }
};

export const searchDynamicsRequest = async (req, res) => {
  try {
    //obtener deta del req body
    const {
      schemaDB,
      functionDB,
      operacion,
      filtroNombre,
      filtroTipo,
      filtroFechaInicial,
      filtroFechaFinal,
      filtroEstadoMultiple,
    } = req.body;

    const results = await pool.query(
      `SELECT ${schemaDB}${functionDB}(operacion => $1, id_escuela_p => $2, parametro_nombre => $3, parametro_id_tipo => $4, parametro_fecha_inicial => $5::DATE, parametro_fecha_final => $6::DATE, parametro_estado_multiple => $7 )`,
      [
        operacion,
        req.user.id_escuela,
        filtroNombre,
        filtroTipo,
        filtroFechaInicial,
        filtroFechaFinal,
        filtroEstadoMultiple,
      ]
    );

    //vallidar resultados
    if (
      results.rows[0][functionDB] == null ||
      results.rows[0][functionDB] == 0
    ) {
      return res
        .status(404)
        .json({ message: "No se han encontrado resultados..." });
    }

    return res.status(200).json(results.rows[0][functionDB]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hubo un error inesperado:" });
  }
};

export const getRolUserRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `select * from configuracion.qry_generalidades(8)`
    );
    const data = results.rows[0].qry_generalidades;
    if (data === 0 || data == null) {
      return res
        .status(404)
        .json({ message: "No se encontraron resultados..." });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado..." });
  }
}

/** SECCION GENERALIDADES DEL MODULO SOPORTE */
export const getEstadosTicketRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `select * from configuracion.qry_generalidades(11)`
    );
    const data = results.rows[0].qry_generalidades;
    if (data === 0 || data == null) {
      return res
        .status(404)
        .json({ message: "No se encontraron resultados..." });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado..." });
  }
}

export const getTipoTicketRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `select * from configuracion.qry_generalidades(12)`
    );
    const data = results.rows[0].qry_generalidades;
    if (data === 0 || data == null) {
      return res
        .status(404)
        .json({ message: "No se encontraron resultados..." });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado..." });
  }
}

export const getProridadTicketRequest = async (req, res) => {
  try {
    const results = await pool.query(
      `select * from configuracion.qry_generalidades(13)`
    );
    const data = results.rows[0].qry_generalidades;
    if (data === 0 || data == null) {
      return res
        .status(404)
        .json({ message: "No se encontraron resultados..." });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error inesperado..." });
  }
}

