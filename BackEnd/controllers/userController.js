const User = require('../models/userModel');

exports.getAllUsers = (req, res) => {
  User.getAll((error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const id = req.params.id;
  User.getById(id, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(results[0]);
  });
};

exports.createUser = (req, res) => {
  const userData = req.body;
  User.create(userData, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ id: results.insertId, ...userData });
  });
};

// ✅ MÉTODO NUEVO - UPDATE
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const userData = req.body;
  
  User.update(id, userData, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente', id: id });
  });
};

// ✅ MÉTODO NUEVO - DELETE
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  
  User.delete(id, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  });
};