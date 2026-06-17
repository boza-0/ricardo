const bcrypt = require('bcryptjs');

const usersRepository = require('../users/users.repository');

async function registerUser({ username, password }) {
    const passwordHash = await bcrypt.hash(password, 10);

    await usersRepository.createUser({ username, passwordHash });
}

async function authenticateUser({ username, password }) {
    const user = await usersRepository.findUserByUsername(username);

    if (!user) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
        return null;
    }

    return {
        id: user.id_usuario,
        username: user.username
    };
}

module.exports = {
    registerUser,
    authenticateUser
};
