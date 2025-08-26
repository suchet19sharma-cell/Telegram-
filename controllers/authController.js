const bcrypt = require('bcryptjs');
const path = require('path');

const mockdb = require('../mockdb');

exports.getRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
};

exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = mockdb.findUserByUsername(username);
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        mockdb.createUser({
            username,
            password: hashedPassword,
        });

        res.redirect('/api/auth/login');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/api/auth/login');
    });
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = mockdb.findUserByUsername(username);
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        req.session.userId = user.id;
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
