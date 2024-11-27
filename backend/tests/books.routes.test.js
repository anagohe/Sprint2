const request = require('supertest');
const express = require('express');
const booksRoutes = require('../routes/books');
const booksController = require('../controllers/booksController');

jest.mock('../controllers/booksController'); // Mock de los controladores

const app = express();
app.use(express.json());
app.use('/api/books', booksRoutes);

describe('Books Routes', () => {
  it('debería manejar GET /api/books', async () => {
    booksController.getAllBooks.mockImplementation((req, res) =>
      res.status(200).json([{ id: 1, title: 'Book Title' }])
    );
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, title: 'Book Title' }]);
  });

  it('debería manejar POST /api/books', async () => {
    booksController.createBook.mockImplementation((req, res) =>
      res.status(201).json({ id: 1, message: 'Book created' })
    );
    const res = await request(app).post('/api/books').send({ title: 'Book Title' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, message: 'Book created' });
  });
});
