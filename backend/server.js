const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.execute(
            `
      INSERT INTO usuarios (username, password_hash)
      VALUES (?, ?)
      `,
            [username, passwordHash]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username already exists' });
        }

        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
