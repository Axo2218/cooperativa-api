const { GoogleGenerativeAI } = require("@google/generative-ai");

// LLAVE HARDCODEADA PARA PRUEBA DEFINITIVA
const apiKey = "AIzaSyC8uRYFce8HfvFOedy7IRbFnBRjbuyG_iE";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    console.log("Probando conexión directa con llave hardcodeada...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hola");
    const response = await result.response;
    console.log("¡ÉXITO TOTAL! Respuesta:", response.text());
  } catch (e) {
    console.error("FALLO INCLUSO CON LLAVE HARDCODEADA:", e.message);
  }
}
run();
