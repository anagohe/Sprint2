const express = require('express');

const router = express.Router();

const bookController = require('../controllers/bookController');

// Rutas para libros
router.get('/', bookController.getAllBooks);                   // Obtener todos los libros
router.get('/:id', bookController.getBookById);               // Obtener un libro específico por ID
router.post('/', bookController.addBook);                      // Agregar un libro
router.put('/:id', bookController.updateBook);                 // Actualizar un libro por ID
router.delete('/:id', bookController.deleteBook);              // Eliminar un libro por ID

module.exports = router;
