const express = require('express');
const router = express.Router();
const quotesController = require('../controllers/quotesController');

router.get('/', quotesController.getAllQuotes); // Obtener todas las citas
router.get('/:id', quotesController.getQuoteById); // Obtener una cita por ID
router.post('/', quotesController.createQuote); // Crear una nueva cita
router.put('/:id', quotesController.updateQuote); // Actualizar una cita por ID
router.delete('/:id', quotesController.deleteQuote); // Eliminar una cita por ID

module.exports = router;
