const express = require('express');
const router = express.Router();
const db = require('../config/database');
const userController = require('../controllers/userController');

// Ruta de login
router.post('/login', userController.login);

// Ruta de prueba
router.get('/test', userController.testConnection);

// LOGIN
router.post('/login', (req, res) => {
    const { Correo, Contrasena } = req.body;

    // Validación de campos vacíos
    if (!Correo || !Contrasena) {
        return res.status(400).json({ error: 'Debe ingresar correo y contraseña' });
    }

    const query = 'SELECT * FROM usuario WHERE Correo = ? AND Contrasena = ?';
    db.query(query, [Correo, Contrasena], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }
        res.json({ success: true, user: results[0] });
    });
});

// OBTENER TODOS LOS USUARIOS
router.get('/', (req, res) => {
    db.query('SELECT * FROM usuario', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(results);
    });
});

// OBTENER USUARIO POR CORREO
router.get('/:correo', (req, res) => {
    const correo = req.params.correo;
    db.query('SELECT * FROM usuario WHERE Correo = ?', [correo], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error al obtener usuario' });
        }
        if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(results[0]);
    });
});

// CREAR USUARIO
router.post('/', (req, res) => {
    const { Correo, Contrasena } = req.body;

    if (!Correo || !Contrasena) {
        return res.status(400).json({ error: 'Debe ingresar correo y contraseña' });
    }

    db.query(
        'INSERT INTO usuario (Correo, Contrasena) VALUES (?, ?)',
        [Correo, Contrasena],
        (err, result) => {
            if (err) {
                console.error('Error al crear usuario:', err);
                return res.status(500).json({ error: 'Error al crear usuario' });
            }
            res.json({ success: true, message: 'Usuario creado', id: result.insertId });
        }
    );
});

// ACTUALIZAR USUARIO
router.put('/:correo', (req, res) => {
    const correo = req.params.correo;
    const { Contrasena } = req.body;

    if (!Contrasena) {
        return res.status(400).json({ error: 'Debe ingresar la nueva contraseña' });
    }

    db.query('UPDATE usuario SET Contrasena = ? WHERE Correo = ?', [Contrasena, correo], (err) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        res.json({ success: true, message: 'Usuario actualizado' });
    });
});

// ELIMINAR USUARIO
router.delete('/:correo', (req, res) => {
    const correo = req.params.correo;
    db.query('DELETE FROM usuario WHERE Correo = ?', [correo], (err) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }
        res.json({ success: true, message: 'Usuario eliminado' });
    });
});

module.exports = router;
