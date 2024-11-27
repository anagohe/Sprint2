const db = require('../config/db');

// Obtener todas las citas
exports.getAllQuotes = (req, res) => {
    const sql = 'SELECT * FROM Quotes';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener las citas' });
        } else {
            res.status(200).json(results);
        }
    });
};

// Obtener una cita por ID
exports.getQuoteById = (req, res) => {
    const id = req.params.id; // Obtener el 'id' de los parámetros
    const sql = 'SELECT * FROM Quotes WHERE quote_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener la cita' });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'Cita no encontrada' });
        } else {
            res.status(200).json(result[0]);
        }
    });
};

// Crear una nueva cita
exports.createQuote = (req, res) => {
    const { quote_text, writer } = req.body; // Captura quote_text y writer
    const sql = 'INSERT INTO Quotes (quote_text, writer) VALUES (?, ?)';
    db.query(sql, [quote_text, writer], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al crear la cita' });
        } else {
            res.status(201).json({ message: 'Cita creada', quoteId: result.insertId });
        }
    });
};

// Actualizar una cita
exports.updateQuote = (req, res) => {
    const { quote_text, writer } = req.body; // Captura quote_text y writer de la solicitud
    const quoteId = req.params.id; // Obtener el id de la cita
    const sql = `
        UPDATE Quotes
        SET quote_text = ?, writer = ?
        WHERE quote_id = ?;
    `;
    db.query(sql, [quote_text, writer, quoteId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al actualizar la cita' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Cita no encontrada' });
        } else {
            res.status(200).json({ message: 'Cita actualizada' });
        }
    });
};

// Eliminar una cita por ID
exports.deleteQuote = (req, res) => {
    const quoteId = req.params.id; // Obtener el 'id' de los parámetros
    const sql = 'DELETE FROM Quotes WHERE quote_id = ?'; // Cambiado a usar quote_id
    db.query(sql, [quoteId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al eliminar la cita' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Cita no encontrada' });
        } else {
            res.status(200).json({ message: 'Cita eliminada' });
        }
    });
};
