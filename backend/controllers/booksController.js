const db = require('../config/db');

// Obtener todos los libros
exports.getAllBooks = async (req, res) => {
    const sql = 'SELECT * FROM Books';
    try {
        const [results] = await db.query(sql); // Usamos await para manejar la promesa
        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener los libros:', err.message);
        res.status(500).json({ message: 'Error al obtener los libros' });
    }
};

// Obtener un libro por ID
exports.getBookById = async (req, res) => {
    const sql = 'SELECT * FROM Books WHERE book_id = ?';
    try {
        const [results] = await db.query(sql, [req.params.id]);
        if (results.length === 0) {
            res.status(404).json({ message: 'Libro no encontrado' });
        } else {
            res.status(200).json(results[0]);
        }
    } catch (err) {
        console.error('Error al obtener el libro:', err.message);
        res.status(500).json({ message: 'Error al obtener el libro' });
    }
};

// Crear un nuevo libro
exports.createBook = async (req, res) => {
    const { title, author, genre, read_date, user_id } = req.body;
    const sql = 'INSERT INTO Books (title, author, genre, read_date, user_id) VALUES (?, ?, ?, ?, ?)';
    try {
        const [result] = await db.query(sql, [title, author, genre, read_date, user_id]);
        res.status(201).json({ message: 'Libro creado', bookId: result.insertId });
    } catch (err) {
        console.error('Error al crear el libro:', err.message);
        res.status(500).json({ message: 'Error al crear el libro' });
    }
};

// Actualizar un libro
exports.updateBook = async (req, res) => {
    const { title, author, genre, read_date, user_id } = req.body;
    const sql = `
        UPDATE Books 
        SET title = ?, author = ?, genre = ?, read_date = ?, user_id = ? 
        WHERE book_id = ?`;
    try {
        const [result] = await db.query(sql, [title, author, genre, read_date, user_id, req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Libro no encontrado' });
        } else {
            res.status(200).json({ message: 'Libro actualizado' });
        }
    } catch (err) {
        console.error('Error al actualizar el libro:', err.message);
        res.status(500).json({ message: 'Error al actualizar el libro' });
    }
};

// Eliminar un libro
exports.deleteBook = async (req, res) => {
    const sql = 'DELETE FROM Books WHERE book_id = ?';
    try {
        const [result] = await db.query(sql, [req.params.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Libro no encontrado' });
        } else {
            res.status(200).json({ message: 'Libro eliminado' });
        }
    } catch (err) {
        console.error('Error al eliminar el libro:', err.message);
        res.status(500).json({ message: 'Error al eliminar el libro' });
    }
};
