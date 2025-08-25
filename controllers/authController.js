const bcrypt = require('bcryptjs');
const path = require('path');

// In-memory user store
const users = [];
let userIdCounter = 1;

exports.getRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
};

exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: userIdCounter++,
            username,
            password: hashedPassword,
        };
        users.push(newUser);

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

        const user = users.find(u => u.username === username);
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
