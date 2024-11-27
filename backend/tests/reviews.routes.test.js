const request = require('supertest');
const express = require('express');
const reviewsRoutes = require('../routes/reviews');
const reviewsController = require('../controllers/reviewsController');

jest.mock('../controllers/reviewsController'); // Mock de los controladores

const app = express();
app.use(express.json());
app.use('/api/reviews', reviewsRoutes);

describe('Reviews Routes', () => {
  it('debería manejar GET /api/reviews', async () => {
    reviewsController.getAllReviews.mockImplementation((req, res) =>
      res.status(200).json([{ id: 1, review: 'Great book' }])
    );
    const res = await request(app).get('/api/reviews');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, review: 'Great book' }]);
  });

  it('debería manejar POST /api/reviews', async () => {
    reviewsController.createReview.mockImplementation((req, res) =>
      res.status(201).json({ id: 1, message: 'Review created' })
    );
    const res = await request(app).post('/api/reviews').send({ review: 'Great book' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, message: 'Review created' });
  });
});
