const db = require('../config/db');

// Obtener todas las citas
exports.getAllQuotes = (req, res) => {
    const sql = 'SELECT * FROM citas WHERE privado = FALSE;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Agregar una nueva cita
exports.addQuote = (req, res) => {
    const { cita, libro_id, autor, privado } = req.body;
    const sql = 'INSERT INTO citas (cita, libro_id, autor, privado) VALUES (?, ?, ?, ?)';

    db.query(sql, [cita, libro_id, autor, privado], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, mensaje: 'Cita agregada con éxito' });
    });
};

// Editar una cita
exports.updateQuote = (req, res) => {
    const { id } = req.params;
    const { cita, libro_id, autor, privado } = req.body;

    const sql = 'UPDATE citas SET cita = ?, libro_id = ?, autor = ?, privado = ? WHERE id = ?';
    
    db.query(sql, [cita, libro_id, autor, privado, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }
        res.status(200).json({ mensaje: 'Cita actualizada con éxito' });
    });
};

// Eliminar una cita
exports.deleteQuote = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM citas WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }
        res.status(200).json({ mensaje: 'Cita eliminada con éxito' });
    });
};
