const db = require('../config/db');


const handleQuery = (res, sql, params, successMessage) => {
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'No encontrado' });
        }
        res.status(200).json(successMessage ? { mensaje: successMessage } : result);
    });
};

exports.getAllBooks = (req, res) => {
    const sql = 'SELECT * FROM libros WHERE privado = FALSE;';
    handleQuery(res, sql, [], null);
};

exports.addBook = (req, res) => {
    const { titulo, genero, autor, fecha_leida, calificacion, reseña, privado } = req.body;
    const sql = 'INSERT INTO libros (titulo, genero, autor, fecha_leida, calificacion, reseña, privado) VALUES (?, ?, ?, ?, ?, ?, ?)';
    handleQuery(res, sql, [titulo, genero, autor, fecha_leida, calificacion, reseña, privado], 'Libro agregado con éxito');
};

exports.updateBook = (req, res) => {
    const { id } = req.params;
    const { titulo, genero, autor, fecha_leida, calificacion, reseña, privado } = req.body;
    const sql = 'UPDATE libros SET titulo = ?, genero = ?, autor = ?, fecha_leida = ?, calificacion = ?, reseña = ?, privado = ? WHERE id = ?';
    handleQuery(res, sql, [titulo, genero, autor, fecha_leida, calificacion, reseña, privado, id], 'Libro actualizado con éxito');
};

exports.deleteBook = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM libros WHERE id = ?';
    handleQuery(res, sql, [id], 'Libro eliminado con éxito');
};

exports.getBookById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM libros WHERE id = ? AND privado = FALSE;';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {  // Verifica si se encontró el libro
            return res.status(404).json({ mensaje: 'Libro no encontrado o es privado' });
        }
        res.status(200).json(result[0]);  // Enviar el primer libro encontrado
    });
};
