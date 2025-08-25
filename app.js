require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'mysecretkey', // In production, use an environment variable
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static('public'));

const homeController = require('./controllers/homeController');
const { isAuthenticated } = require('./middleware/auth');

app.get('/', homeController.getHomepage);

// Define routes
app.use('/api/auth', require('./routes/auth'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
