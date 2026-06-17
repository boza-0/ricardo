const pool = require('../db');

async function createUser({ username, passwordHash }) {
    await pool.execute(
        `
      INSERT INTO usuarios (username, password_hash)
      VALUES (?, ?)
      `,
        [username, passwordHash]
    );
}

async function findUserByUsername(username) {
    const [rows] = await pool.execute(
        `
      SELECT id_usuario, username, password_hash
      FROM usuarios
      WHERE username = ?
      LIMIT 1
      `,
        [username]
    );

    return rows[0] ?? null;
}

module.exports = {
    createUser,
    findUserByUsername
};
