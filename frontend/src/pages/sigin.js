import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sign = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí irá la lógica de registro
        console.log('Registrando usuario...');
        // Después de registrar, puedes redirigir al login
        // navigate('/login');
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

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3 text-start">
                        <label htmlFor="registro">Registro Académico</label>
                        <input 
                            type="text" 
                            id="registro" 
                            className="form-control" 
                            placeholder="Ej: 202100123"
                            required
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3 text-start">
                            <label htmlFor="nombres">Nombres</label>
                            <input 
                                type="text" 
                                id="nombres" 
                                className="form-control" 
                                placeholder="Tus nombres"
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3 text-start">
                            <label htmlFor="apellidos">Apellidos</label>
                            <input 
                                type="text" 
                                id="apellidos" 
                                className="form-control" 
                                placeholder="Tus apellidos"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3 text-start">
                        <label htmlFor="correo">Correo electrónico</label>
                        <input 
                            type="email" 
                            id="correo" 
                            className="form-control" 
                            placeholder="ejemplo@usac.edu.gt"
                            required
                        />
                    </div>
                    <div className="form-group mb-3 text-start">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="form-control" 
                            placeholder="Crea una contraseña"
                            required
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Registrarse
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