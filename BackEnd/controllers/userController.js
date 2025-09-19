const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controlador para login
exports.login = async (req, res) => {
    try {
        const { Correo, Contrasena } = req.body;
        
        console.log('Intento de login para:', Correo);
        
        // Verificar si el usuario existe
        const query = 'SELECT * FROM usuarios WHERE Correo = ?';
        db.query(query, [Correo], async (error, results) => {
            if (error) {
                console.error('Error en consulta:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error del servidor' 
                });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Correo o contraseña incorrectos' 
                });
            }
            
            const user = results[0];
            
            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(Contrasena, user.Contrasena);
            
            if (!isPasswordValid) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Correo o contraseña incorrectos' 
                });
            }
            
            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.Correo 
                }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );
            
            // Devolver respuesta exitosa
            res.json({
                success: true,
                message: 'Login exitoso',
                user: {
                    id: user.id,
                    nombre: user.Nombre,
                    correo: user.Correo,
                    rol: user.Rol
                },
                token: token
            });
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error del servidor' 
        });
    }
};

// Controlador para prueba de conexión
exports.testConnection = (req, res) => {
    res.json({ 
        success: true, 
        message: 'Conexión exitosa con el backend en puerto 3001' 
    });
};