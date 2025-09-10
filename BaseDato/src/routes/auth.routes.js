const r = require('express').Router();
const c = require('../controllers/usuarios.controller');
r.post('/register', c.register);

module.exports = r;
const {pool} = require('../db');
const hash = require('../utils/crypto');


