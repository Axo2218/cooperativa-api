const pool = require('../config/db');

const obtenerCatalogos = async (req, res) => {
    try {
        // Obtenemos los barcos
        const embarcaciones = await pool.query("SELECT emb_id, emb_nombre FROM embarcacion");

        // Obtenemos los capitanes (concatenando su nombre y apellido)
        const capitanes = await pool.query("SELECT per_id, per_nombre || ' ' || per_apellidos AS nombre_completo FROM personal");

        const zonas = await pool.query("SELECT zona_id, zona_nombre FROM zona_pesca");
        const categorias = await pool.query("SELECT * FROM categoria_embarcacion");
        const cooperativas = await pool.query("SELECT coop_id, coop_nombre FROM cooperativa");

        // Devolvemos todo en un solo paquete
        res.status(200).json({
            embarcaciones: embarcaciones.rows,
            capitanes: capitanes.rows,
            zonas: zonas.rows,
            categorias: categorias.rows,
            cooperativas: cooperativas.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los catálogos' });
    }
};

module.exports = { obtenerCatalogos };