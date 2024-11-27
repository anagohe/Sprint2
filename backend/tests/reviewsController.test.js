const request = require('supertest');
const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const db = require('../config/db');

jest.mock('../config/db');

const app = express();
app.use(express.json());

app.get('/api/reviews', reviewsController.getAllReviews);
app.get('/api/reviews/:id', reviewsController.getReviewById);
app.post('/api/reviews', reviewsController.createReview);
app.put('/api/reviews/:id', reviewsController.updateReview);
app.delete('/api/reviews/:id', reviewsController.deleteReview);

describe('Reviews Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle GET /api/reviews', async () => {
        db.query.mockImplementation((sql, callback) => {
            callback(null, [{ review_id: 1, review_text: 'Great book' }]);
        });

        const res = await request(app).get('/api/reviews');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ review_id: 1, review_text: 'Great book' }]);
    });

    it('should handle GET /api/reviews/:id', async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, [{ review_id: 1, review_text: 'Great book' }]);
        });

        const res = await request(app).get('/api/reviews/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ review_id: 1, review_text: 'Great book' });
    });

    it('should handle POST /api/reviews', async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, { insertId: 1 });
        });

        const res = await request(app).post('/api/reviews').send({ book_id: 1, rating: 5, review_text: 'Great book' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: 'Reseña creada', reviewId: 1 });
    });

    it('should handle PUT /api/reviews/:id', async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app).put('/api/reviews/1').send({ rating: 5, review_text: 'Updated review' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Reseña actualizada' });
    });

    it('should handle DELETE /api/reviews/:id', async () => {
        db.query.mockImplementation((sql, params, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const res = await request(app).delete('/api/reviews/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Reseña eliminada' });
    });
});