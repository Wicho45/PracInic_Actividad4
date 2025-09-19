const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ---------------- Conexión a la base de datos ----------------
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'praini',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a MySQL - Esquema praini");
});

// ---------------- REGISTRO DE USUARIO (Adaptado para tu esquema) ----------------
app.post("/api/users/register", (req, res) => {
  const { registro, nombres, apellidos, correo, password } = req.body;
  
  console.log('Solicitud de registro:', { registro, nombres, apellidos, correo });
  
  if (!correo || !password || !registro || !nombres || !apellidos) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  // Iniciar transacción
  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Error iniciando transacción:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    try {
      // 1. Verificar si el usuario ya existe
      const checkUserQuery = "SELECT * FROM usuario WHERE Correo = ?";
      const [userResults] = await db.promise().query(checkUserQuery, [correo]);
      
      if (userResults.length > 0) {
        await db.promise().rollback();
        return res.status(409).json({ error: "El correo ya está registrado" });
      }

      // 2. Verificar si el registro académico ya existe
      const checkAlumnoQuery = "SELECT * FROM alumno WHERE Registro_Academico = ?";
      const [alumnoResults] = await db.promise().query(checkAlumnoQuery, [registro]);
      
      if (alumnoResults.length > 0) {
        await db.promise().rollback();
        return res.status(409).json({ error: "El registro académico ya existe" });
      }

      // 3. Insertar en tabla usuario
      const insertUsuarioQuery = "INSERT INTO usuario (Correo, Contrasena) VALUES (?, ?)";
      const [usuarioResult] = await db.promise().query(insertUsuarioQuery, [correo, password]);

      // 4. Insertar en tabla alumno
      const insertAlumnoQuery = "INSERT INTO alumno (Registro_Academico, Nombre, Apellido, Correo) VALUES (?, ?, ?, ?)";
      await db.promise().query(insertAlumnoQuery, [registro, nombres, apellidos, correo]);

      // Confirmar transacción
      await db.promise().commit();

      res.json({ 
        success: true, 
        message: "Usuario registrado exitosamente", 
        user: {
          registro: registro,
          nombre: `${nombres} ${apellidos}`,
          correo: correo
        }
      });

    } catch (error) {
      await db.promise().rollback();
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });
});

// ---------------- LOGIN (Adaptado para tu esquema) ----------------
app.post("/api/users/login", (req, res) => {
  const { correo, contrasena } = req.body;

  console.log('Intento de login para:', correo);

  if (!correo || !contrasena) {
    return res.status(400).json({ success: false, message: "Correo y contraseña son requeridos" });
  }

  const query = `
    SELECT u.Correo, u.Contrasena, a.Registro_Academico, a.Nombre, a.Apellido 
    FROM usuario u 
    LEFT JOIN alumno a ON u.Correo = a.Correo 
    WHERE u.Correo = ?
  `;

  db.query(query, [correo], (err, results) => {
    if (err) {
      console.error("Error en consulta:", err);
      return res.status(500).json({ success: false, message: "Error del servidor" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
    }

    const user = results[0];
    
    // Comparación simple de contraseña (en producción usar bcrypt)
    if (user.Contrasena !== contrasena) {
      return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
    }

    console.log('Login exitoso para:', correo);
    res.json({ 
      success: true, 
      message: "Login exitoso",
      user: {
        correo: user.Correo,
        registro: user.Registro_Academico,
        nombre: user.Nombre,
        apellido: user.Apellido,
        nombreCompleto: `${user.Nombre} ${user.Apellido}`
      }
    });
  });
});

// ---------------- OBTENER DATOS DE ALUMNO ----------------
app.get("/api/alumno/:correo", (req, res) => {
  const correo = req.params.correo;

  const query = `
    SELECT a.Registro_Academico, a.Nombre, a.Apellido, a.Correo
    FROM alumno a 
    WHERE a.Correo = ?
  `;

  db.query(query, [correo], (err, results) => {
    if (err) {
      console.error("Error obteniendo alumno:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    res.json(results[0]);
  });
});

// ---------------- OBTENER CURSOS DE ALUMNO ----------------
app.get("/api/alumno/:correo/cursos", (req, res) => {
  const correo = req.params.correo;

  const query = `
    SELECT c.ID_Curso, c.Nombre, c.Creditos, ap.Nota, ap.Estado
    FROM alumno a
    LEFT JOIN aprobadas ap ON a.Registro_Academico = ap.Registro_Academico
    LEFT JOIN curso c ON ap.ID_Curso = c.ID_Curso
    WHERE a.Correo = ?
  `;

  db.query(query, [correo], (err, results) => {
    if (err) {
      console.error("Error obteniendo cursos:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    res.json(results);
  });
});

// ---------------- RUTAS DE PRUEBA ----------------
app.get("/", (req, res) => {
  res.json({ 
    message: "API funcionando con esquema praini",
    timestamp: new Date().toISOString()
  });
});

app.get("/api", (req, res) => {
  res.json({ 
    message: "API praini funcionando correctamente",
    database: "praini",
    status: "conectado"
  });
});

// ---------------- OBTENER PUBLICACIONES (ADAPTADO A TU ESQUEMA) ----------------
app.get("/api/publicaciones", (req, res) => {
  const query = `
    SELECT 
      p.ID_Publicacion,
      p.Mensaje,
      p.Fecha,
      p.Correo,
      p.ID_Profesor,
      a.Nombre as Nombre_Usuario,
      a.Apellido as Apellido_Usuario,
      prof.Nombre as Nombre_Profesor,
      prof.Apellido as Apellido_Profesor,
      c.Nombre as Nombre_Curso,
      c.ID_Curso
    FROM publicacion p
    LEFT JOIN usuario u ON p.Correo = u.Correo
    LEFT JOIN alumno a ON u.Correo = a.Correo
    LEFT JOIN profesor prof ON p.ID_Profesor = prof.ID_Profesor
    LEFT JOIN curso c ON p.ID_Curso = c.ID_Curso
    ORDER BY p.Fecha DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error obteniendo publicaciones:", err);
      return res.status(500).json({ error: "Error del servidor al obtener publicaciones" });
    }
    
    // Para tu esquema, los comentarios están en una tabla separada pero no relacionada directamente
    // con publicaciones, así que devolvemos las publicaciones sin comentarios
    const publicaciones = results.map(publicacion => ({
      ...publicacion,
      // Como no hay relación directa, no podemos obtener comentarios fácilmente
      comentarios: []
    }));
    
    res.json(publicaciones);
  });
});

// ---------------- CREAR PUBLICACIÓN ----------------
app.post("/api/publicaciones", (req, res) => {
  const { correo, mensaje, id_profesor, id_curso } = req.body;

  if (!correo || !mensaje) {
    return res.status(400).json({ error: "Correo y mensaje son requeridos" });
  }

  const query = `
    INSERT INTO publicacion (Correo, ID_Profesor, Mensaje, Fecha, ID_Curso)
    VALUES (?, ?, ?, CURDATE(), ?)
  `;

  db.query(query, [correo, id_profesor || null, mensaje, id_curso || null], (err, result) => {
    if (err) {
      console.error("Error creando publicación:", err);
      return res.status(500).json({ error: "Error del servidor al crear publicación" });
    }
    
    res.json({ 
      success: true, 
      message: "Publicación creada exitosamente",
      id: result.insertId 
    });
  });
});

// ---------------- OBTENER CURSOS ----------------
app.get("/api/cursos", (req, res) => {
  const query = "SELECT ID_Curso, Nombre, Creditos FROM curso ORDER BY Nombre";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error obteniendo cursos:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }
    res.json(results);
  });
});

// ---------------- OBTENER PROFESORES ----------------
app.get("/api/profesores", (req, res) => {
  const query = "SELECT ID_Profesor, Nombre, Apellido FROM profesor ORDER BY Nombre";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error obteniendo profesores:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }
    res.json(results);
  });
});

// ---------------- OBTENER COMENTARIOS (SI LOS HUBIERA) ----------------
// Nota: En tu esquema actual, los comentarios no están relacionados con publicaciones
// Esta función es por si decides agregar la relación después
app.get("/api/comentarios", (req, res) => {
  const query = `
    SELECT 
      c.*,
      a.Nombre,
      a.Apellido,
      a.Correo
    FROM comentarios c
    LEFT JOIN alumno a ON c.Registro_Academico = a.Registro_Academico
    ORDER BY c.Fecha_Calificacion DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error obteniendo comentarios:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }
    res.json(results);
  });
});

// ---------------- MANEJO DE ERRORES ----------------
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ---------------- INICIAR SERVIDOR ----------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`=== Servidor corriendo en puerto ${PORT} ===`);
  console.log(`=== Esquema de base de datos: praini ===`);
});