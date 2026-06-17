const authService = require('./auth.service');

function hasMissingCredentials(username, password) {
    return !username || !password;
}

async function register(req, res) {
    try {
        const { username, password } = req.body;

        if (hasMissingCredentials(username, password)) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        await authService.registerUser({ username, password });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username already exists' });
        }

        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (hasMissingCredentials(username, password)) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const authenticatedUser = await authService.authenticateUser({ username, password });

        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json({
            message: 'Login successful',
            user: authenticatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
}

module.exports = {
    register,
    login
};
