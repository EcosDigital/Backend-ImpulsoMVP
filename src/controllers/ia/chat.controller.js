import { pool } from "../../config/db.js";

export const chatRequest = async (req, res) => {
  const { messages } = req.body;
  const { id_escuela} = req.params
  //conseguir api key por escuela
  const results = await pool.query(
    "SELECT configuracion.qry_escuelas(operacion => $1, id_registro => $2)",
    [7, id_escuela]
  );

  //validar si esta activoocio de chatbot
  if (results.rows[0].qry_escuelas[0].maneja_chatbot == false) {
    return res.status(400).json({
      error: "Opps! este servicio no se encuentra activo en tu escuela...",
    });
  }

  //obtener el API KEY de la escuela
  const API_KEY = results.rows[0].qry_escuelas[0].api_ia;
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" +
    API_KEY;

  //construir el sistemas de respuesta para los messages

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Formato de mensaje inválido" });
  }

  const userMessage = messages[messages.length - 1].text;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 400,
    },
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      res.json({ text: data.candidates[0].content.parts[0].text });
    } else {
      console.error("Respuesta inesperada:", data);
      res.status(500).json({ error: "Respuesta no válida de Gemini" });
    }
  } catch (error) {
    console.error("Error al contactar Gemini:", err);
    res.status(500).json({ error: "Error interno" });
  }
};
