const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    // La forma correcta de listar modelos en la SDK es llamar a un endpoint de la API
    // pero vamos a probar con los nombres más probables uno por uno
    const models = ["gemini-pro", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-1.0-pro"];
    
    for (const m of models) {
      try {
        console.log(`Probando modelo: ${m}...`);
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("hi");
        console.log(`¡ÉXITO! El modelo ${m} funciona.`);
        process.exit(0);
      } catch (err) {
        console.log(`Fallo con ${m}: ${err.message}`);
      }
    }
    console.log("Ningún modelo estándar funcionó.");
    process.exit(1);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
