import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Dashboard = () => {
    // Estado para los comentarios (simulado)
    const [comentarios, setComentarios] = useState({
        1: ['Confirmo, muy recomendable estudiar con tiempo.', 'También recomiendo repasar ejercicios extra.'],
        2: ['Sus exámenes son pesados, pero vale la pena.']
    });
    
    const [nuevoComentario, setNuevoComentario] = useState({
        1: '',
        2: ''
    });

    // Función para manejar comentarios
    const handleComentarioChange = (publicacionId, texto) => {
        setNuevoComentario(prev => ({
            ...prev,
            [publicacionId]: texto
        }));
    };

    const agregarComentario = (publicacionId) => {
        if (nuevoComentario[publicacionId].trim()) {
            setComentarios(prev => ({
                ...prev,
                [publicacionId]: [...prev[publicacionId], nuevoComentario[publicacionId]]
            }));
            setNuevoComentario(prev => ({
                ...prev,
                [publicacionId]: ''
            }));
        }
    };

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
                                    to="/dashboard"
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

            <div className="container mt-4">
                {/* Filtros */}
                <div className="card p-3 mb-4">
                    <h5 className="mb-3">Filtros de Publicaciones</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <select className="form-select">
                                <option selected>Filtrar por Curso</option>
                                <option>Matemática Básica 1</option>
                                <option>Programación 1</option>
                                <option>Física 2</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select">
                                <option selected>Filtrar por Catedrático</option>
                                <option>Ing. Pérez</option>
                                <option>Ing. López</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Buscar por nombre de curso"
                            />
                        </div>
                        <div className="col-md-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Buscar por nombre de catedrático"
                            />
                        </div>
                    </div>
                </div>

                {/* Publicaciones */}
                <h5 className="mb-3">Publicaciones Recientes</h5>

                {/* Ejemplo Publicación 1 */}
                <div className="card mb-3 p-3">
                    <h6 className="fw-bold">Juan Pérez <small className="text-muted">- 10/09/2025</small></h6>
                    <p><strong>Curso:</strong> Programación 1</p>
                    <p>El curso está muy bien estructurado, aunque requiere bastante práctica. El catedrático explica con claridad.</p>
                    <hr />
                    <h6 className="fw-bold">Comentarios</h6>
                    {comentarios[1].map((comentario, index) => (
                        <div key={index} className="comment-box mb-2 p-2 bg-light rounded">
                            <p className="mb-1"><strong>Usuario:</strong> {comentario}</p>
                        </div>
                    ))}
                    <textarea 
                        className="form-control mb-2" 
                        rows="2" 
                        placeholder="Escribe un comentario..."
                        value={nuevoComentario[1]}
                        onChange={(e) => handleComentarioChange(1, e.target.value)}
                    ></textarea>
                    <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => agregarComentario(1)}
                    >
                        Comentar
                    </button>
                </div>

                {/* Ejemplo Publicación 2 */}
                <div className="card mb-3 p-3">
                    <h6 className="fw-bold">María García <small className="text-muted">- 09/09/2025</small></h6>
                    <p><strong>Catedrático:</strong> Ing. López</p>
                    <p>El ingeniero es muy exigente, pero aprendes bastante en sus clases.</p>
                    <hr />
                    <h6 className="fw-bold">Comentarios</h6>
                    {comentarios[2].map((comentario, index) => (
                        <div key={index} className="comment-box mb-2 p-2 bg-light rounded">
                            <p className="mb-1"><strong>Usuario:</strong> {comentario}</p>
                        </div>
                    ))}
                    <textarea 
                        className="form-control mb-2" 
                        rows="2" 
                        placeholder="Escribe un comentario..."
                        value={nuevoComentario[2]}
                        onChange={(e) => handleComentarioChange(2, e.target.value)}
                    ></textarea>
                    <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => agregarComentario(2)}
                    >
                        Comentar
                    </button>
                </div>

                {/* Publicación vacía para demostrar más contenido */}
                <div className="card mb-3 p-3">
                    <h6 className="fw-bold">Carlos Martínez <small className="text-muted">- 08/09/2025</small></h6>
                    <p><strong>Curso:</strong> Matemática Básica 1</p>
                    <p>Excelente curso para fundamentos matemáticos. Muy bien explicado.</p>
                    <hr />
                    <h6 className="fw-bold">Comentarios</h6>
                    <div className="comment-box mb-2 p-2 bg-light rounded">
                        <p className="mb-1"><strong>Laura:</strong> Totalmente de acuerdo, muy buen curso introductorio.</p>
                    </div>
                    <textarea 
                        className="form-control mb-2" 
                        rows="2" 
                        placeholder="Escribe un comentario..."
                    ></textarea>
                    <button className="btn btn-sm btn-primary">Comentar</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
