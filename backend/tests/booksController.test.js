const booksController = require('../controllers/booksController');

// Mock para la base de datos
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const db = require('../config/db');

describe('booksController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getAllBooks', () => {
    it('debería devolver todos los libros cuando la consulta sea exitosa', () => {
      const mockResults = [{ id: 1, title: 'Libro 1' }, { id: 2, title: 'Libro 2' }];
      db.query.mockImplementation((sql, callback) => callback(null, mockResults));

      booksController.getAllBooks(req, res);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM Books', expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    it('debería manejar errores en la base de datos', () => {
      db.query.mockImplementation((sql, callback) => callback(new Error('Error de base de datos')));

      booksController.getAllBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al obtener los libros' });
    });
  });

  describe('getBookById', () => {
    it('debería devolver un libro por ID cuando se encuentre', () => {
      req.params.id = 1;
      const mockResult = [{ id: 1, title: 'Libro 1' }];
      db.query.mockImplementation((sql, params, callback) => callback(null, mockResult));

      booksController.getBookById(req, res);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM Books WHERE book_id = ?', [1], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult[0]);
    });

    it('debería devolver un error 404 si no se encuentra el libro', () => {
      req.params.id = 1;
      db.query.mockImplementation((sql, params, callback) => callback(null, []));

      booksController.getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Libro no encontrado' });
    });
  });

  describe('createBook', () => {
    it('debería crear un nuevo libro y devolver éxito', () => {
      req.body = { title: 'Nuevo libro', author: 'Autor', genre: 'Ficción', read_date: '2023-01-01', user_id: 1 };
      db.query.mockImplementation((sql, params, callback) => callback(null, { insertId: 1 }));

      booksController.createBook(req, res);

      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO Books (title, author, genre, read_date, user_id) VALUES (?, ?, ?, ?, ?)',
        ['Nuevo libro', 'Autor', 'Ficción', '2023-01-01', 1],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Libro creado', bookId: 1 });
    });

    it('debería manejar errores al crear un libro', () => {
      req.body = { title: 'Nuevo libro', author: 'Autor', genre: 'Ficción', read_date: '2023-01-01', user_id: 1 };
      db.query.mockImplementation((sql, params, callback) => callback(new Error('Error de base de datos')));

      booksController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al crear el libro' });
    });
  });
});
