import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Configuración de la conexión
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a MySQL");
});

// ---------------- LOGIN ---------------- //
app.post("/api/users/login", (req, res) => {
  const { Correo, Contrasena } = req.body;

  const query = "SELECT * FROM usuario WHERE Correo = ? AND Contrasena = ?";
  db.query(query, [Correo, Contrasena], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al iniciar sesión" });
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Correo o contraseña incorrecta" });
    }
    res.json({ success: true, user: results[0] });
  });
});

// ---------------- OBTENER TODOS LOS USUARIOS ---------------- //
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM usuario", (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener usuarios" });
    res.json(results);
  });
});

// ---------------- OBTENER USUARIO POR CORREO ---------------- //
app.get("/api/users/:correo", (req, res) => {
  const correo = req.params.correo;
  db.query("SELECT * FROM usuario WHERE Correo = ?", [correo], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener usuario" });
    if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(results[0]);
  });
});

// ---------------- CREAR USUARIO ---------------- //
app.post("/api/users", (req, res) => {
  const { Correo, Contrasena } = req.body;
  db.query(
    "INSERT INTO usuario (Correo, Contrasena) VALUES (?, ?)",
    [Correo, Contrasena],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear usuario" });
      res.json({ success: true, message: "Usuario creado", id: result.insertId });
    }
  );
});

// ---------------- ACTUALIZAR USUARIO ---------------- //
app.put("/api/users/:correo", (req, res) => {
  const correo = req.params.correo;
  const { Contrasena } = req.body;
  db.query(
    "UPDATE usuario SET Contrasena = ? WHERE Correo = ?",
    [Contrasena, correo],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al actualizar usuario" });
      res.json({ success: true, message: "Usuario actualizado" });
    }
  );
});

// ---------------- ELIMINAR USUARIO ---------------- //
app.delete("/api/users/:correo", (req, res) => {
  const correo = req.params.correo;
  db.query("DELETE FROM usuario WHERE Correo = ?", [correo], (err) => {
    if (err) return res.status(500).json({ error: "Error al eliminar usuario" });
    res.json({ success: true, message: "Usuario eliminado" });
  });
});

// ---------------- RUTA DE PRUEBA ---------------- //
app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

// ---------------- INICIAR SERVIDOR ---------------- //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
