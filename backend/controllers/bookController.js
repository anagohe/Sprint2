const db = require('../config/db');

// Obtener todos los libros
exports.getAllBooks = (req, res) => {
    const sql = 'SELECT * FROM libros WHERE privado = FALSE;';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Agregar un nuevo libro
exports.addBook = (req, res) => {
    const { titulo, genero, autor, fecha_leida, calificacion, reseña, privado } = req.body;

    console.log('Datos recibidos:', req.body); // Agrega esto para depurar

    const sql = 'INSERT INTO libros (titulo, genero, autor, fecha_leida, calificacion, reseña, privado) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [titulo, genero, autor, fecha_leida, calificacion, reseña, privado], (err, result) => {
        if (err) {
            console.error('Error al insertar libro:', err); // Mejora la posible salida de error
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, mensaje: 'Libro agregado con éxito' });
    });
};


// Editar un libro
exports.updateBook = (req, res) => {
    const { id } = req.params;
    const { titulo, genero, autor, fecha_leida, calificacion, reseña, privado } = req.body;
    const sql = 'UPDATE libros SET titulo = ?, genero = ?, autor = ?, fecha_leida = ?, calificacion = ?, reseña = ?, privado = ? WHERE id = ?';

    db.query(sql, [titulo, genero, autor, fecha_leida, calificacion, reseña, privado, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.status(200).json({ mensaje: 'Libro actualizado con éxito' });
    });
};

// Eliminar un libro
exports.deleteBook = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM libros WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.status(200).json({ mensaje: 'Libro eliminado con éxito' });
    });
};

// Obtener un libro por ID
exports.getBookById = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM libros WHERE id = ? AND privado = FALSE;';
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        }
        res.status(200).json(results[0]); // Devuelve el primer libro encontrado
    });
};
