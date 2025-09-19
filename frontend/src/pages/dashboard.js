import React, { useState, useEffect } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();
    const [tipoPublicacion, setTipoPublicacion] = useState('');
    const [opciones, setOpciones] = useState([]);
    const [mostrarCombo, setMostrarCombo] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [formData, setFormData] = useState({
        mensaje: '',
        id_curso: '',
        id_profesor: '',
        fecha: new Date().toISOString().split('T')[0]
    });
    const [usuario, setUsuario] = useState(null);
    const [usuarioCompleto, setUsuarioCompleto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Obtener datos del usuario y opciones
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setUsuario(user);
            obtenerUsuarioCompleto(user.correo);
        }

        obtenerCursos();
        obtenerProfesores();
    }, []);

    const obtenerUsuarioCompleto = async (correo) => {
        try {
            const response = await fetch(`http://localhost:3001/api/alumno/${correo}`);
            if (response.ok) {
                const data = await response.json();
                setUsuarioCompleto(data);
            }
        } catch (err) {
            console.error('Error obteniendo datos del usuario:', err);
        }
    };

    const obtenerCursos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/cursos');
            if (response.ok) {
                const data = await response.json();
                
                // Filtrar cursos únicos por nombre
                const cursosUnicos = data.filter((curso, index, self) =>
                    index === self.findIndex(c => c.Nombre === curso.Nombre)
                );
                
                setCursos(cursosUnicos);
            }
        } catch (err) {
            console.error('Error obteniendo cursos:', err);
        }
    };

    const obtenerProfesores = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/profesores');
            if (response.ok) {
                const data = await response.json();
                
                // Filtrar profesores únicos por nombre completo
                const profesoresUnicos = data.filter((profesor, index, self) =>
                    index === self.findIndex(p => 
                        p.Nombre === profesor.Nombre && 
                        p.Apellido === profesor.Apellido
                    )
                );
                
                setProfesores(profesoresUnicos);
            }
        } catch (err) {
            console.error('Error obteniendo profesores:', err);
        }
    };

    const mostrarOpciones = (tipo) => {
        setTipoPublicacion(tipo);
        
        if (tipo === 'curso') {
            setOpciones(cursos);
            setMostrarCombo(true);
            setFormData(prev => ({ ...prev, id_profesor: '' }));
        } else if (tipo === 'catedratico') {
            setOpciones(profesores);
            setMostrarCombo(true);
            setFormData(prev => ({ ...prev, id_curso: '' }));
        } else {
            setMostrarCombo(false);
            setFormData(prev => ({ ...prev, id_curso: '', id_profesor: '' }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.mensaje.trim()) {
            setError('El mensaje es requerido');
            setLoading(false);
            return;
        }

        if (!usuario || !usuario.correo) {
            setError('Usuario no autenticado');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/publicaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: usuario.correo,
                    mensaje: formData.mensaje,
                    id_curso: formData.id_curso || null,
                    id_profesor: formData.id_profesor || null,
                    fecha: formData.fecha
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear publicación');
            }

            setSuccess('Publicación creada exitosamente');
            setFormData({
                mensaje: '',
                id_curso: '',
                id_profesor: '',
                fecha: new Date().toISOString().split('T')[0]
            });
            setTipoPublicacion('');
            setMostrarCombo(false);

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Error creando publicación:', err);
            setError(err.message || 'Error al crear publicación');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener el nombre completo a mostrar
    const obtenerNombreCompleto = () => {
        if (usuarioCompleto && usuarioCompleto.Nombre && usuarioCompleto.Apellido) {
            return `${usuarioCompleto.Nombre} ${usuarioCompleto.Apellido}`;
        } else if (usuario && usuario.nombreCompleto) {
            return usuario.nombreCompleto;
        } else if (usuario && usuario.nombre) {
            return usuario.nombre + (usuario.apellido ? ` ${usuario.apellido}` : '');
        } else if (usuario && usuario.correo) {
            return usuario.correo;
        } else {
            return 'Usuario no identificado';
        }
    };

    return (
        <div>
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

            {/* Mensajes de estado */}
            {error && (
                <div className="container mt-3">
                    <div className="alert alert-danger alert-dismissible fade show">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                </div>
            )}

            {success && (
                <div className="container mt-3">
                    <div className="alert alert-success alert-dismissible fade show">
                        {success}
                    </div>
                </div>
            )}

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
                                value={obtenerNombreCompleto()} 
                                readOnly
                            />
                            {usuarioCompleto && usuarioCompleto.Registro_Academico && (
                                <small className="text-muted">
                                    Registro académico: {usuarioCompleto.Registro_Academico}
                                </small>
                            )}
                        </div>

                        {/* Selección entre Curso o Catedrático */}
                        <div className="form-group mb-3">
                            <label htmlFor="tipoPublicacion">Seleccionar tipo de publicación</label>
                            <select 
                                className="form-select" 
                                id="tipoPublicacion" 
                                value={tipoPublicacion}
                                onChange={(e) => mostrarOpciones(e.target.value)}
                                required
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
                                <select 
                                    id="comboSelect" 
                                    className="form-select"
                                    name={tipoPublicacion === 'curso' ? 'id_curso' : 'id_profesor'}
                                    value={tipoPublicacion === 'curso' ? formData.id_curso : formData.id_profesor}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {opciones.map((opcion) => (
                                        <option key={tipoPublicacion === 'curso' ? opcion.ID_Curso : opcion.ID_Profesor} 
                                                value={tipoPublicacion === 'curso' ? opcion.ID_Curso : opcion.ID_Profesor}>
                                            {tipoPublicacion === 'curso' ? opcion.Nombre : `${opcion.Nombre} ${opcion.Apellido}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Mensaje */}
                        <div className="form-group mb-3">
                            <label htmlFor="mensaje">Mensaje de la Publicación *</label>
                            <textarea 
                                id="mensaje" 
                                className="form-control" 
                                rows="4" 
                                placeholder="Escribe tu publicación aquí..."
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>

                        {/* Fecha */}
                        <div className="form-group mb-3">
                            <label htmlFor="fecha">Fecha de creación</label>
                            <input 
                                type="date" 
                                id="fecha" 
                                className="form-control"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Botón */}
                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Publicando...
                                    </>
                                ) : 'Publicar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Layout;