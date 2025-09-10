const {pool} = require('../db');
const hash = require('../utils/crypto');
const crypto = require("crypto");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Campos Faltantes' });
        }

        const passwordHash = hash(password);
        const verificationCode = crypto.randomBytes(20).toString('hex');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

