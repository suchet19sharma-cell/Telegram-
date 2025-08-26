// In-memory user store
const users = [];
let userIdCounter = 1;

function findUserById(id) {
    return users.find(u => u.id === id);
}

function findUserByUsername(username) {
    return users.find(u => u.username === username);
}

function createUser(user) {
    const newUser = {
        id: userIdCounter++,
        ...user
    };
    users.push(newUser);
    return newUser;
}

module.exports = {
    findUserById,
    findUserByUsername,
    createUser,
};
