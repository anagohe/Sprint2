const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const booksRoutes = require('./routes/books');
const reviewsRoutes = require('./routes/reviews');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/books', booksRoutes);
app.use('/api/reviews', reviewsRoutes);

// Iniciar el servidor solo si no es utilizado en pruebas
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
