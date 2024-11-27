const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const reviewsRoutes = require('./routes/reviews');
const quotesRoutes = require('./routes/quotes'); // Importa las rutas de citas

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/books', booksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/quotes', quotesRoutes); // Define la ruta base para citas

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
