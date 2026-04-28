const pool = require('../config/db');

// Obtener todos los clientes
const getClientes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, coop.coop_nombre
            FROM clientes c
            LEFT JOIN cooperativa coop ON c.cli_fk_cooperativa = coop.coop_id
            ORDER BY c.cli_id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un cliente por ID
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM clientes WHERE cli_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un cliente
const createCliente = async (req, res) => {
    try {
        const {
            cli_nombre,
            cli_rfc,
            cli_tipo,
            cli_telefono,
            cli_direccion,
            cli_fk_cooperativa
        } = req.body;

        const result = await pool.query(
            `INSERT INTO clientes 
            (cli_nombre, cli_rfc, cli_tipo, cli_telefono, cli_direccion, cli_fk_cooperativa) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [cli_nombre, cli_rfc, cli_tipo, cli_telefono, cli_direccion, cli_fk_cooperativa]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un cliente
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            cli_nombre,
            cli_rfc,
            cli_tipo,
            cli_telefono,
            cli_direccion,
            cli_fk_cooperativa
        } = req.body;

        const result = await pool.query(
            `UPDATE clientes 
            SET cli_nombre = $1, 
                cli_rfc = $2, 
                cli_tipo = $3, 
                cli_telefono = $4, 
                cli_direccion = $5, 
                cli_fk_cooperativa = $6 
            WHERE cli_id = $7 RETURNING *`,
            [cli_nombre, cli_rfc, cli_tipo, cli_telefono, cli_direccion, cli_fk_cooperativa, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un cliente
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM clientes WHERE cli_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar porque este cliente tiene ventas asociadas' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};
