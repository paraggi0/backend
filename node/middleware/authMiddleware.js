const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

const verifyAuth = async (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    const authHeader = req.header('Authorization');

    // Prioritas 1: Cek API Key (untuk Android)
    if (apiKey) {
        try {
            const users = await User.findAll({ where: { api_key_hash: { $ne: null } } });
            for (const user of users) {
                if (await bcrypt.compare(apiKey, user.api_key_hash)) {
                    req.user = user;
                    return next();
                }
            }
            return res.status(403).json({ message: 'Akses Ditolak. API Key tidak valid.' });
        } catch (error) {
            return res.status(500).json({ message: 'Kesalahan server saat verifikasi API Key.' });
        }
    }

    // Prioritas 2: Cek JWT Token (untuk Web)
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Hapus "Bearer "
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Token tidak valid, user tidak ditemukan.' });
            }
            req.user = user;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' });
        }
    }

    // Jika tidak ada keduanya
    return res.status(401).json({ message: 'Akses Ditolak. Tidak ada kredensial yang disediakan.' });
};

module.exports = verifyAuth;
