const db = require('../config/db');

// Obtener todas las reseñas con el título del libro
exports.getAllReviews = async (req, res) => {
    const sql = `
        SELECT 
            r.review_id, 
            r.book_id, 
            r.rating, 
            r.review_text, 
            r.created_at, 
            b.title AS book_title
        FROM Reviews r
        JOIN Books b ON r.book_id = b.book_id
    `;

    try {
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener las reseñas:', err.message);
        res.status(500).json({ message: 'Error al obtener las reseñas' });
    }
};

// Obtener una reseña por ID con el título del libro
exports.getReviewById = (req, res) => {
    const sql = `
        SELECT 
            r.review_id, 
            r.book_id, 
            r.user_id, 
            r.rating, 
            r.review_text, 
            r.created_at, 
            r.updated_at,
            b.title AS book_title
        FROM Reviews r
        JOIN Books b ON r.book_id = b.book_id
        WHERE r.review_id = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error al obtener la reseña:', err.message);
            res.status(500).json({ message: 'Error al obtener la reseña' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Reseña no encontrada' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

// Crear una nueva reseña
exports.createReview = (req, res) => {
    const { book_id, rating, review_text } = req.body;

    // Validaciones
    if (!book_id || !rating || !review_text) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'La calificación debe estar entre 1 y 5' });
    }

    const sql = `
        INSERT INTO Reviews (book_id, rating, review_text) 
        VALUES (?, ?, ?)`;
    db.query(sql, [book_id, rating, review_text], (err, result) => {
        if (err) {
            console.error('Error al crear la reseña:', err.message);
            res.status(500).json({ message: 'Error al crear la reseña' });
        } else {
            res.status(201).json({ message: 'Reseña creada', reviewId: result.insertId });
        }
    });
};

// Actualizar una reseña por ID
exports.updateReview = (req, res) => {
    const { rating, review_text } = req.body;

    // Validaciones
    if (!rating || !review_text) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const sql = `
        UPDATE Reviews 
        SET rating = ?, review_text = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE review_id = ?`;
    db.query(sql, [rating, review_text, req.params.id], (err, result) => {
        if (err) {
            console.error('Error al actualizar la reseña:', err.message);
            res.status(500).json({ message: 'Error al actualizar la reseña' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Reseña no encontrada' });
        } else {
            res.status(200).json({ message: 'Reseña actualizada' });
        }
    });
};

// Eliminar una reseña por ID
exports.deleteReview = (req, res) => {
    const sql = 'DELETE FROM Reviews WHERE review_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la reseña:', err.message);
            res.status(500).json({ message: 'Error al eliminar la reseña' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Reseña no encontrada' });
        } else {
            res.status(200).json({ message: 'Reseña eliminada' });
        }
    });
};
