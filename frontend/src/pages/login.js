import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Correo: correo, Contrasena: contrasena })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || 'Correo o contraseña incorrecta');
                return;
            }

            // Guardar usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirigir a layout
            navigate('/layout');
        } catch (err) {
            console.error('Error en login:', err);
            setError('Error al conectar con el servidor');
        }
    };

    const goToSignup = () => navigate('/sigin');
    const goToRestore = () => navigate('/restore');

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
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group mb-3 text-start">
                            <label htmlFor="email">Correo</label>
                            <input 
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Ingresa tu correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
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
                            />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="d-grid gap-2">
                            <button 
                                type="button"
                                onClick={handleLogin}
                                className="btn btn-primary w-100"
                            >
                                Iniciar Sesión
                            </button>
                            <button 
                                type="button"
                                onClick={goToSignup}
                                className="btn btn-outline-secondary w-100"
                            >
                                Registrar
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
