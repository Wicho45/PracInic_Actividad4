import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Profile = () => {
    // Estado para los datos del usuario
    const [usuario, setUsuario] = useState({
        registro: '202100123',
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan.perez@usac.edu.gt'
    });

    // Estado para los cursos aprobados
    const [cursos, setCursos] = useState([
        { nombre: 'Matemática Básica 1', creditos: 5 },
        { nombre: 'Programación 1', creditos: 4 },
        { nombre: 'Física 1', creditos: 5 }
    ]);

    // Estado para nuevo curso a agregar
    const [nuevoCurso, setNuevoCurso] = useState('');

    const agregarCurso = () => {
        if (!nuevoCurso) return;

        const cursoMap = {
            MB1: { nombre: 'Matemática Básica 1', creditos: 5 },
            MB2: { nombre: 'Matemática Básica 2', creditos: 5 },
            PROG1: { nombre: 'Programación 1', creditos: 4 },
            PROG2: { nombre: 'Programación 2', creditos: 4 },
            FIS1: { nombre: 'Física 1', creditos: 5 },
            FIS2: { nombre: 'Física 2', creditos: 5 },
            CALC1: { nombre: 'Cálculo 1', creditos: 5 },
            CALC2: { nombre: 'Cálculo 2', creditos: 5 },
        };

        const cursoAgregar = cursoMap[nuevoCurso];
        if (cursoAgregar) {
            setCursos(prev => [...prev, cursoAgregar]);
            setNuevoCurso('');
        }
    };

    const totalCreditos = cursos.reduce((total, curso) => total + curso.creditos, 0);

    return (
        <div className="page-container">
            {/* Navbar */}
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
                                <NavLink className="nav-link" to="/layout" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                                    Pantalla Inicial
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/dashboard" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                                    Crear Publicación
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/profile" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                                    Ver Perfil
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Perfil */}
            <div className="container profile-section mt-4">
                {/* Datos del usuario */}
                <div className="card p-4 mb-4">
                    <h4 className="mb-3 text-center">Mi Perfil</h4>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="registro" className="form-label">Registro Académico</label>
                            <input type="text" id="registro" className="form-control" value={usuario.registro} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombres</label>
                            <input type="text" id="nombre" className="form-control" value={usuario.nombre} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="apellido" className="form-label">Apellidos</label>
                            <input type="text" id="apellido" className="form-control" value={usuario.apellido} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                            <input type="email" id="correo" className="form-control" value={usuario.correo} disabled />
                        </div>
                        <button type="button" className="btn btn-primary w-100">Modificar mis datos</button>
                    </form>
                </div>

                {/* Cursos aprobados */}
                <div className="card p-4 mb-4">
                    <h4 className="mb-3 text-center">Cursos Aprobados</h4>
                    <ul className="course-list">
                        {cursos.map((curso, idx) => (
                            <li key={idx}><strong>{curso.nombre}</strong> - {curso.creditos} Créditos</li>
                        ))}
                    </ul>
                    <p className="mt-2"><strong>Total de créditos:</strong> {totalCreditos}</p>

                    <div className="mt-3">
                        <label htmlFor="nuevoCurso" className="form-label">Agregar curso aprobado</label>
                        <select id="nuevoCurso" className="form-select" value={nuevoCurso} onChange={e => setNuevoCurso(e.target.value)}>
                            <option value="">-- Selecciona un curso --</option>
                            <option value="MB1">Matemática Básica 1</option>
                            <option value="MB2">Matemática Básica 2</option>
                            <option value="PROG1">Programación 1</option>
                            <option value="PROG2">Programación 2</option>
                            <option value="FIS1">Física 1</option>
                            <option value="FIS2">Física 2</option>
                            <option value="CALC1">Cálculo 1</option>
                            <option value="CALC2">Cálculo 2</option>
                        </select>
                        <button type="button" className="btn btn-primary w-100 mt-2" onClick={agregarCurso}>Agregar</button>
                    </div>
                </div>

                {/* Buscador de perfiles */}
                <div className="card p-4">
                    <h4 className="mb-3 text-center">Buscar Perfil de Usuario</h4>
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="mb-3">
                            <label htmlFor="buscarRegistro" className="form-label">Número de Registro Académico</label>
                            <input type="text" id="buscarRegistro" className="form-control" placeholder="Ingresa el número de registro" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Buscar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
