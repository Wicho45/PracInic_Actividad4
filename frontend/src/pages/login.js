import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // URL base de tu API - BACKEND en puerto 3001
    const API_BASE_URL = 'http://localhost:3001';

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        
        try {
            console.log('Intentando login para:', correo);
            
            const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    correo: correo, 
                    contrasena: contrasena 
                })
            });

            // Verificar el estado de la respuesta
            console.log('Estado de respuesta:', response.status);
            
            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Respuesta no JSON:', text);
                throw new Error('La respuesta del servidor no es válida');
            }
            
            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (!response.ok) {
                setError(data.message || 'Error en la autenticación');
                setLoading(false);
                return;
            }

            if (!data.success) {
                setError(data.message || 'Credenciales incorrectas');
                setLoading(false);
                return;
            }

            // Guardar usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Mostrar mensaje de éxito
            setError(`✅ ${data.message}`);
            
            // Redirigir a layout después de 1 segundo
            setTimeout(() => {
                navigate('/layout');
            }, 1000);

        } catch (err) {
            console.error('Error completo en login:', err);
            setError('No se pudo conectar con el servidor. Verifica que el servidor esté ejecutándose en el puerto 3001.');
        } finally {
            setLoading(false);
        }
    };

    const goToSignup = () => navigate('/sigin');
    const goToRestore = () => navigate('/restore');

    // Función para probar la conexión con el servidor
    const testConnection = async () => {
        try {
            setError('Probando conexión con servidor (puerto 3001)...');
            const response = await fetch(`${API_BASE_URL}/api`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            setError(`✅ Conexión exitosa: ${data.message}`);
        } catch (err) {
            setError('❌ No se pudo conectar con el servidor en puerto 3001');
            console.error('Error de conexión:', err);
        }
    };

    // Manejar tecla Enter en el formulario
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div>
            <div className="bg-overlay"></div>
            <div className="container login-container">
                <div className="card p-4 col-md-5 text-center">
                    <img 
                        src="https://portal.usac.edu.gt/wp-content/uploads/2022/08/tricentenaria-2019-color-solo.png" 
                        alt="Logo Facultad de Ingeniería USAC" 
                        className="logo mx-auto d-block"
                    />
                    <h3>Escuela de Ciencias y Sistemas</h3>
                    <p className="text-muted">Facultad de Ingeniería - USAC</p>
                    
                    <div className="mb-3">
                        <button onClick={testConnection} className="btn btn-info btn-sm">
                            Probar Conexión con Servidor
                        </button>
                    </div>
                    
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }} onKeyPress={handleKeyPress}>
                        <div className="form-group mb-3 text-start">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input 
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Ingresa tu correo institucional"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="form-group mb-3 text-start">
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Ingresa tu contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        {error && (
                            <div className={`alert ${error.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                {error}
                            </div>
                        )}
                        <div className="d-grid gap-2">
                            <button 
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Iniciando sesión...
                                    </>
                                ) : 'Iniciar Sesión'}
                            </button>
                            <button 
                                type="button"
                                onClick={goToSignup}
                                className="btn btn-outline-primary w-100"
                            >
                                Crear Nueva Cuenta
                            </button>
                        </div>
                    </form>
                    <div className="mt-3">
                        <button 
                            onClick={goToRestore}
                            className="btn btn-link text-decoration-none p-0"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;