const db = require('../config/db');

// Obtener todas las reseñas
exports.getAllReviews = (req, res) => {
    const sql = `
        SELECT review_id, book_id, user_id, rating, review_text, created_at, updated_at 
        FROM Reviews`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener las reseñas' });
        }
        res.status(200).json(results);
    });
};

// Obtener una reseña por ID
exports.getReviewById = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'ID de la reseña es requerido' });

    const sql = `
        SELECT review_id, book_id, user_id, rating, review_text, created_at, updated_at 
        FROM Reviews 
        WHERE review_id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener la reseña' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.status(200).json(result[0]);
    });
};

// Crear una nueva reseña
exports.createReview = (req, res) => {
    const { book_id, user_id, rating, review_text } = req.body;

    if (!book_id || !user_id || !rating || !review_text) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `
        INSERT INTO Reviews (book_id, user_id, rating, review_text) 
        VALUES (?, ?, ?, ?)`;
    db.query(sql, [book_id, user_id, rating, review_text], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al crear la reseña' });
        }
        res.status(201).json({ message: 'Reseña creada', reviewId: result.insertId });
    });
};

// Actualizar una reseña por ID
exports.updateReview = (req, res) => {
    const { id } = req.params;
    const { rating, review_text } = req.body;

    if (!rating || !review_text) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const sql = `
        UPDATE Reviews 
        SET rating = ?, review_text = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE review_id = ?`;
    db.query(sql, [rating, review_text, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar la reseña' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.status(200).json({ message: 'Reseña actualizada' });
    });
};

// Eliminar una reseña por ID
exports.deleteReview = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Reviews WHERE review_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar la reseña' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        res.status(200).json({ message: 'Reseña eliminada' });
    });
};
