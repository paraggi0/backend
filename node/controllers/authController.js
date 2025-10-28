const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserLog } = require('../models');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }
        await UserLog.create({ id_user: user.id, email: user.email, logs_status: 'Login successful' });
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '8h' }
        );
        res.json({ message: 'Login berhasil', token });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan internal.' });
    }
};
