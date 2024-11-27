const db = require('../config/db');

// Obtener todos los usuarios
exports.getAllUsers = (req, res) => {
    const sql = 'SELECT user_id, username, email, created_at, updated_at FROM Users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener los usuarios');
        } else {
            res.status(200).json(results);
        }
    });
};

// Obtener un usuario por ID
exports.getUserById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT user_id, username, email, created_at, updated_at FROM Users WHERE user_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener el usuario');
        } else if (result.length === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.status(200).json(result[0]);
        }
    });
};

// Crear un nuevo usuario
exports.createUser = (req, res) => {
    const { username, email, password } = req.body;
    const sql = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al crear el usuario');
        } else {
            res.status(201).send({ message: 'Usuario creado', userId: result.insertId });
        }
    });
};

// Actualizar un usuario por ID
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const sql = `
        UPDATE Users 
        SET username = ?, email = ?, password = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ?`;
    db.query(sql, [username, email, password, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al actualizar el usuario');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.status(200).send({ message: 'Usuario actualizado' });
        }
    });
};

// Eliminar un usuario por ID
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Users WHERE user_id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al eliminar el usuario');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.status(200).send({ message: 'Usuario eliminado' });
        }
    });
};
