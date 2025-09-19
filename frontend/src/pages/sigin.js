import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sign = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        registro: '',
        nombres: '',
        apellidos: '',
        correo: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validación
        if (!formData.registro || !formData.nombres || !formData.apellidos || !formData.correo || !formData.password) {
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }

        // Validar formato de correo
        if (!formData.correo.includes('@')) {
            setError('Por favor ingresa un correo válido');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registro: formData.registro,
                    nombres: formData.nombres,
                    apellidos: formData.apellidos,
                    correo: formData.correo,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear usuario');
            }

            setSuccess('Usuario registrado correctamente. Redirigiendo al login...');
            console.log('Usuario registrado:', data);
            
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Error en registro:', err);
            setError(err.message || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="page-container">
            <div className="card p-4 col-md-6 text-center">
                <img 
                    src="https://portal.usac.edu.gt/wp-content/uploads/2022/08/tricentenaria-2019-color-solo.png" 
                    alt="Logo Facultad de Ingeniería USAC" 
                    className="logo mx-auto d-block"
                />
                <h3>Registro de Usuario</h3>
                <p className="text-muted">Escuela de Ciencias y Sistemas - FIUSAC</p>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success" role="alert">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3 text-start">
                        <label htmlFor="registro">Registro Académico *</label>
                        <input 
                            type="text" 
                            id="registro" 
                            className="form-control" 
                            placeholder="Ej: 202100123"
                            value={formData.registro}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3 text-start">
                            <label htmlFor="nombres">Nombres *</label>
                            <input 
                                type="text" 
                                id="nombres" 
                                className="form-control" 
                                placeholder="Tus nombres"
                                value={formData.nombres}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3 text-start">
                            <label htmlFor="apellidos">Apellidos *</label>
                            <input 
                                type="text" 
                                id="apellidos" 
                                className="form-control" 
                                placeholder="Tus apellidos"
                                value={formData.apellidos}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3 text-start">
                        <label htmlFor="correo">Correo electrónico *</label>
                        <input 
                            type="email" 
                            id="correo" 
                            className="form-control" 
                            placeholder="ejemplo@usac.edu.gt"
                            value={formData.correo}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3 text-start">
                        <label htmlFor="password">Contraseña *</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="form-control" 
                            placeholder="Crea una contraseña segura"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                        <button 
                            type="button" 
                            onClick={goToLogin} 
                            className="btn btn-outline-secondary"
                        >
                            Volver al Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Sign;