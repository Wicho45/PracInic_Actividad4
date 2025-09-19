import React, { useState } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();
    const [tipoPublicacion, setTipoPublicacion] = useState('');
    const [opciones, setOpciones] = useState([]);
    const [mostrarCombo, setMostrarCombo] = useState(false);

    const mostrarOpciones = (tipo) => {
        setTipoPublicacion(tipo);
        
        if (tipo === 'curso') {
            setOpciones([
                'Matemática Básica 1',
                'Programación 1',
                'Física 2',
                'Algoritmos'
            ]);
            setMostrarCombo(true);
        } else if (tipo === 'catedratico') {
            setOpciones([
                'Ing. Pérez',
                'Ing. López',
                'Ing. Ramírez'
            ]);
            setMostrarCombo(true);
        } else {
            setMostrarCombo(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Creando publicación...');
    };

    return (
        <div>
            {/* Header / Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/layout">
                        Escuela de Ciencias y Sistemas
                    </Link>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink 
                                    className="nav-link" 
                                    to="/layout"
                                    style={({ isActive }) => ({
                                        fontWeight: isActive ? 'bold' : 'normal'
                                    })}
                                >
                                    Pantalla Inicial
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    className="nav-link" 
                                    to="/layout"
                                    style={({ isActive }) => ({
                                        fontWeight: isActive ? 'bold' : 'normal'
                                    })}
                                >
                                    Crear Publicación
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    className="nav-link" 
                                    to="/profile"
                                    style={({ isActive }) => ({
                                        fontWeight: isActive ? 'bold' : 'normal'
                                    })}
                                >
                                    Ver Perfil
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    className="nav-link" 
                                    to="/login"
                                    style={({ isActive }) => ({
                                        fontWeight: isActive ? 'bold' : 'normal'
                                    })}
                                >
                                    Cerrar Sesión
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Crear Publicación */}
            <div className="container mt-4">
                <div className="card p-4">
                    <h4 className="mb-3">Crear Nueva Publicación</h4>
                    <form onSubmit={handleSubmit}>
                        {/* Usuario (solo lectura) */}
                        <div className="form-group mb-3">
                            <label htmlFor="usuario">Usuario que realiza la publicación</label>
                            <input 
                                type="text" 
                                id="usuario" 
                                className="form-control" 
                                value="Juan Pérez (usuario logueado)" 
                                readOnly
                            />
                        </div>

                        {/* Selección entre Curso o Catedrático */}
                        <div className="form-group mb-3">
                            <label htmlFor="tipoPublicacion">Seleccionar tipo de publicación</label>
                            <select 
                                className="form-select" 
                                id="tipoPublicacion" 
                                value={tipoPublicacion}
                                onChange={(e) => mostrarOpciones(e.target.value)}
                            >
                                <option value="">-- Seleccionar --</option>
                                <option value="curso">Curso</option>
                                <option value="catedratico">Catedrático</option>
                            </select>
                        </div>

                        {/* Combobox dinámico según selección */}
                        {mostrarCombo && (
                            <div className="form-group mb-3">
                                <label htmlFor="comboSelect">
                                    {tipoPublicacion === 'curso' ? 'Seleccionar Curso' : 'Seleccionar Catedrático'}
                                </label>
                                <select id="comboSelect" className="form-select">
                                    <option>-- Seleccionar --</option>
                                    {opciones.map((opcion, index) => (
                                        <option key={index} value={opcion}>
                                            {opcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Mensaje */}
                        <div className="form-group mb-3">
                            <label htmlFor="mensaje">Mensaje de la Publicación</label>
                            <textarea 
                                id="mensaje" 
                                className="form-control" 
                                rows="4" 
                                placeholder="Escribe tu publicación aquí..."
                            ></textarea>
                        </div>

                        {/* Fecha */}
                        <div className="form-group mb-3">
                            <label htmlFor="fecha">Fecha de creación</label>
                            <input 
                                type="date" 
                                id="fecha" 
                                className="form-control"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Botón */}
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Publicar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Layout;