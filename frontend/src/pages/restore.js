import React from 'react';
import { useNavigate } from 'react-router-dom';

const Restore = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí irá la lógica para restaurar la contraseña
        console.log('Restaurando contraseña...');
        // Después de restaurar, puedes redirigir al login
        // navigate('/login');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="page-container">
            <div className="card p-4 col-md-5 text-center">
                <img 
                    src="https://portal.usac.edu.gt/wp-content/uploads/2022/08/tricentenaria-2019-color-solo.png"
                    alt="Logo Facultad de Ingeniería USAC" 
                    className="logo mx-auto d-block"
                />
                <h3>Restaurar Contraseña</h3>
                <p className="text-muted">Escuela de Ciencias y Sistemas - FIUSAC</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3 text-start">
                        <label htmlFor="registro">Registro Académico</label>
                        <input 
                            type="text" 
                            id="registro" 
                            className="form-control" 
                            placeholder="Ingresa tu registro académico"
                            required
                        />
                    </div>

                    <div className="form-group mb-3 text-start">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input 
                            type="email" 
                            id="correo" 
                            className="form-control" 
                            placeholder="Ingresa tu correo electrónico"
                            required
                        />
                    </div>

                    <div className="form-group mb-3 text-start">
                        <label htmlFor="nueva-password">Nueva Contraseña</label>
                        <input 
                            type="password" 
                            id="nueva-password" 
                            className="form-control" 
                            placeholder="Ingresa tu nueva contraseña"
                            required
                        />
                    </div>

                    <div className="form-group mb-3 text-start">
                        <label htmlFor="confirm-password">Confirmar Contraseña</label>
                        <input 
                            type="password" 
                            id="confirm-password" 
                            className="form-control" 
                            placeholder="Confirma tu nueva contraseña"
                            required
                        />
                    </div>

                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary w-100">
                            Restaurar Contraseña
                        </button>
                        <button 
                            type="button" 
                            onClick={goToLogin} 
                            className="btn btn-outline-secondary w-100"
                        >
                            Volver al Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Restore;