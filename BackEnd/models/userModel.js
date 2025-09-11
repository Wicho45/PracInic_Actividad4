const db = require('../config/database');

class User {
  static getAll(callback) {
    db.query('SELECT * FROM usuarios', callback);
  }

  static getById(id, callback) {
    db.query('SELECT * FROM usuarios WHERE id = ?', [id], callback);
  }

  static create(userData, callback) {
    db.query('INSERT INTO usuarios SET ?', userData, callback);
  }

  static update(id, userData, callback) {
    db.query('UPDATE usuarios SET ? WHERE id = ?', [userData, id], callback);
  }

  static delete(id, callback) {
    db.query('DELETE FROM usuarios WHERE id = ?', [id], callback);
  }
}

module.exports = User;