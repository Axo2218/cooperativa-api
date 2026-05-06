const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const modelList = await genAI.getGenerativeModel({ model: "gemini-pro" }); // Esto no es para listar, pero probemos el objeto genAI
    // El método correcto en las versiones recientes suele ser listModels() desde el objeto base
    // Pero vamos a intentar un enfoque más directo: probar gemini-1.5-pro
    console.log("Probando conexión directa...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Conexión exitosa con gemini-1.5-flash");
    process.exit(0);
  } catch (e) {
    console.error("DETALLE DEL ERROR:", e);
    process.exit(1);
  }
}
listModels();
