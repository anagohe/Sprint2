const db = require('../config/db');

// Obtener todos los libros
exports.getAllBooks = (req, res) => {
  const sql = 'SELECT * FROM Books';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener los libros' });
    } else {
      res.status(200).json(results);
    }
  });
};

// Obtener un libro por ID
exports.getBookById = (req, res) => {
  const sql = 'SELECT * FROM Books WHERE book_id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al obtener el libro' });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Libro no encontrado' });
    } else {
      res.status(200).json(result[0]);
    }
  });
};

// Crear un nuevo libro
exports.createBook = (req, res) => {
  const { title, author, genre, read_date, user_id } = req.body;
  const sql = 'INSERT INTO Books (title, author, genre, read_date, user_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, author, genre, read_date, user_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al crear el libro' }); // Cambiar a JSON
    } else {
      res.status(201).json({ message: 'Libro creado', bookId: result.insertId });
    }
  });
};

// Actualizar un libro
exports.updateBook = (req, res) => {
  const { title, author, genre, read_date, user_id } = req.body;
  const sql = `
    UPDATE Books 
    SET title = ?, author = ?, genre = ?, read_date = ?, user_id = ? 
    WHERE book_id = ?`;
  db.query(sql, [title, author, genre, read_date, user_id, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar el libro' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Libro no encontrado' });
    } else {
      res.status(200).json({ message: 'Libro actualizado' });
    }
  });
};

// Eliminar un libro
exports.deleteBook = (req, res) => {
  const sql = 'DELETE FROM Books WHERE book_id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al eliminar el libro' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Libro no encontrado' });
    } else {
      res.status(200).json({ message: 'Libro eliminado' });
    }
  });
};
