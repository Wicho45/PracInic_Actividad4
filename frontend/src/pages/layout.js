import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Dashboard = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [comentarios, setComentarios] = useState({});
    const [nuevoComentario, setNuevoComentario] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Obtener publicaciones desde la base de datos
    useEffect(() => {
        obtenerPublicaciones();
    }, []);

    const obtenerPublicaciones = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/publicaciones');
            
            if (!response.ok) {
                throw new Error('Error al obtener publicaciones');
            }
            
            const data = await response.json();
            setPublicaciones(data);
            
            // Inicializar estados de comentarios
            const comentariosIniciales = {};
            data.forEach(pub => {
                comentariosIniciales[pub.ID_Publicacion] = pub.comentarios || [];
            });
            setComentarios(comentariosIniciales);
            setNuevoComentario({});
            
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar publicaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleComentarioChange = (publicacionId, texto) => {
        setNuevoComentario(prev => ({
            ...prev,
            [publicacionId]: texto
        }));
    };

    const agregarComentario = async (publicacionId) => {
        if (!nuevoComentario[publicacionId]?.trim()) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            const response = await fetch('http://localhost:3001/api/comentarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ID_Publicacion: publicacionId,
                    Correo: user.correo,
                    Mensaje: nuevoComentario[publicacionId]
                })
            });

            if (!response.ok) {
                throw new Error('Error al agregar comentario');
            }

            // Actualizar comentarios localmente
            setComentarios(prev => ({
                ...prev,
                [publicacionId]: [...prev[publicacionId], {
                    Correo: user.correo,
                    Mensaje: nuevoComentario[publicacionId],
                    Fecha_Calificacion: new Date().toISOString()
                }]
            }));

            setNuevoComentario(prev => ({
                ...prev,
                [publicacionId]: ''
            }));

        } catch (err) {
            console.error('Error:', err);
            setError('Error al agregar comentario');
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

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
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

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

                {publicaciones.length === 0 ? (
                    <div className="text-center py-5">
                        <h5 className="text-muted">No hay publicaciones aún</h5>
                        <p className="text-muted">Sé el primero en compartir tu experiencia</p>
                    </div>
                ) : (
                    publicaciones.map((publicacion) => (
                        <div key={publicacion.ID_Publicacion} className="card mb-3 p-3">
                            {/* Header de la publicación */}
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h6 className="fw-bold mb-1">
                                        {publicacion.Nombre || 'Usuario Anónimo'}
                                    </h6>
                                    <small className="text-muted">
                                        {new Date(publicacion.Fecha).toLocaleDateString('es-GT', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </small>
                                </div>
                            </div>

                            {/* Contenido de la publicación */}
                            {publicacion.ID_Curso && (
                                <p className="mb-2">
                                    <strong>Curso:</strong> {publicacion.Nombre_Curso}
                                </p>
                            )}
                            
                            {publicacion.ID_Profesor && (
                                <p className="mb-3">
                                    <strong>Catedrático:</strong> {publicacion.Nombre_Profesor}
                                </p>
                            )}

                            <p className="card-text">{publicacion.Mensaje}</p>

                            <hr />

                            {/* Comentarios */}
                            <h6 className="fw-bold mb-3">Comentarios</h6>

                            {comentarios[publicacion.ID_Publicacion]?.length > 0 ? (
                                comentarios[publicacion.ID_Publicacion].map((comentario, index) => (
                                    <div key={index} className="comment-box mb-2 p-2 bg-light rounded">
                                        <p className="mb-1"><strong>{comentario.Correo || 'Usuario'}:</strong> {comentario.Mensaje}</p>
                                        <small className="text-muted">
                                            {comentario.Fecha_Calificacion ? 
                                                new Date(comentario.Fecha_Calificacion).toLocaleDateString() : 
                                                'Ahora'}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No hay comentarios aún</p>
                            )}

                            {/* Formulario para nuevo comentario */}
                            <div className="mt-3">
                                <textarea 
                                    className="form-control mb-2" 
                                    rows="2"
                                    placeholder="Escribe un comentario..."
                                    value={nuevoComentario[publicacion.ID_Publicacion] || ''}
                                    onChange={(e) => handleComentarioChange(publicacion.ID_Publicacion, e.target.value)}
                                />
                                <button 
                                    className="btn btn-sm btn-primary"
                                    onClick={() => agregarComentario(publicacion.ID_Publicacion)}
                                    disabled={!nuevoComentario[publicacion.ID_Publicacion]?.trim()}
                                >
                                    Comentar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;