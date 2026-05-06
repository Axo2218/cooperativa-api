const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require('../config/db');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const chatAI = async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // --- EXTRACCIÓN DE BUSINESS INTELLIGENCE ---
        
        // 1. Recursos Humanos
        const personalRes = await pool.query('SELECT COUNT(*) FROM personal');
        const totalPersonal = personalRes.rows[0].count;

        // 2. Flota y Operaciones
        const flotaRes = await pool.query('SELECT COUNT(*) FROM embarcacion');
        const viajesRes = await pool.query("SELECT COUNT(*) FROM viaje WHERE via_archivado = false");
        
        // 3. Análisis de Rendimiento (KPIs)
        const rendimientoRes = await pool.query(`
            SELECT 
                v.via_id,
                v.via_fecha_salida,
                p.per_nombre as capitan,
                e.emb_nombre as barco,
                COALESCE((SELECT SUM(dc.det_cap_kilogramos) FROM viaje_detalle_captura dc WHERE dc.det_cap_fk_viaje = v.via_id), 0) as total_kilos,
                COALESCE((SELECT SUM(g.gas_cantidad * g.gas_precio_unitario) FROM viaje_gasto g WHERE g.gas_fk_viaje = v.via_id), 0) as total_gastos
            FROM viaje v
            LEFT JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id
            LEFT JOIN personal p ON v.via_fk_capitan = p.per_id
            WHERE v.via_archivado = false
            ORDER BY v.via_id DESC
            LIMIT 3
        `);

        // 4. Totales Globales
        const globalesRes = await pool.query('SELECT SUM(det_cap_kilogramos) as total_kilos FROM viaje_detalle_captura');
        const totalKilosHistorico = globalesRes.rows[0].total_kilos || 0;

        const biContext = {
            empleados: totalPersonal,
            barcos: flotaRes.rows[0].count,
            viajesEnCurso: viajesRes.rows[0].count,
            capturaTotalHistorica: totalKilosHistorico,
            ultimosViajes: rendimientoRes.rows
        };

        // --- PROMPT DE NIVEL SUPERADMIN ---
        const systemPrompt = `Eres COOPIA, la Analista de Inteligencia de Negocios de CooPesca. 
Tienes acceso de SUPERADMIN. Tu misión es analizar comportamientos y ayudar en la toma de decisiones.

PANORAMA GENERAL:
- Empleados totales: ${biContext.empleados}
- Flota: ${biContext.barcos} barcos
- Producción Histórica: ${biContext.capturaTotalHistorica} kg

ANÁLISIS DE RENDIMIENTO RECIENTE (Top 3 Viajes):
${biContext.ultimosViajes.map(v => `- Viaje ID ${v.via_id} (${v.barco}). Capitán: ${v.capitan}. Captura: ${v.total_kilos}kg. Gastos: $${v.total_gastos}`).join('\n')}

INSTRUCCIONES DE ANALISTA:
1. Responde preguntas sobre personal, flota y rendimiento con datos exactos.
2. Analiza los viajes: un viaje es favorable si la captura justifica los gastos.
3. Sugiere mejoras basadas en los datos de los capitanes y barcos.
4. Explica KPIs si el usuario lo pide.
5. Usa un tono ejecutivo y estratégico.

REGLA DE NAVEGACIÓN: Si piden ir a una pestaña, añade [GOTO:nombre_seccion] (dashboard, geolocalizacion, viajes, tripulacion, capturas, gastos).`;

        const result = await model.generateContent(`${systemPrompt}\n\nSuperadmin dice: ${message}`);
        const response = await result.response;
        const text = response.text();

        res.json({ text, isBot: true });

    } catch (error) {
        console.error('Error en COOPIA Superadmin:', error.message);
        res.status(500).json({ error: "Hubo un error al procesar los datos operativos. Por favor, intenta de nuevo." });
    }
};

module.exports = { chatAI };
