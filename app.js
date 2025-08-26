require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const sharedsession = require('express-socket.io-session');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 3000;

let activeUsers = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionMiddleware = session({
    secret: 'mysecretkey', // In production, use an environment variable
    resave: false,
    saveUninitialized: true,
});

app.use(sessionMiddleware);
io.use(sharedsession(sessionMiddleware, {
    autoSave: true
}));

app.use(express.static('public'));

const homeController = require('./controllers/homeController');
const { isAuthenticated } = require('./middleware/auth');
const mockdb = require('./mockdb');

app.get('/', homeController.getHomepage);

// Define routes
app.use('/api/auth', require('./routes/auth'));

io.on('connection', (socket) => {
    if (!socket.handshake.session.userId) {
        return socket.disconnect(true);
    }

    const user = mockdb.findUserById(socket.handshake.session.userId);
    if (!user) {
        return socket.disconnect(true);
    }

    console.log(`${user.username} connected`);
    activeUsers[socket.id] = user.username;
    io.emit('updateUserList', Object.values(activeUsers));

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', {
            username: user.username,
            text: msg
        });
    });

    socket.on('typing', () => {
        socket.broadcast.emit('typing', { username: user.username });
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', { username: user.username });
    });

    socket.on('disconnect', () => {
        console.log(`${user.username} disconnected`);
        delete activeUsers[socket.id];
        io.emit('updateUserList', Object.values(activeUsers));
    });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
