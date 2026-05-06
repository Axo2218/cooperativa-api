const axios = require('axios');
const apiKey = "AIzaSyC8uRYFce8HfvFOedy7IRbFnBRjbuyG_iE";

async function listModels() {
  try {
    console.log("Consultando catálogo de modelos disponibles para tu llave...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await axios.get(url);
    
    if (response.data.models && response.data.models.length > 0) {
      console.log("¡Modelos encontrados! Puedes usar estos:");
      response.data.models.forEach(m => console.log("- " + m.name));
    } else {
      console.log("Google dice que tu llave no tiene modelos permitidos (Lista vacía).");
    }
  } catch (e) {
    console.error("ERROR AL CONSULTAR GOOGLE:", e.response?.data || e.message);
  }
}
listModels();
