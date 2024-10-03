// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const JWT_SECRET = 'adminplus'; // Assurez-vous que cela correspond à votre clé secrète

const userController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const results = await UserModel.findByEmail(email);
            if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
            const user = results[0];

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({
                id: user.ID_logUser,
                email: user.email,
                type: user.type
            }, JWT_SECRET, { expiresIn: '1h' });

            res.json({ token, email: user.email, type: user.type });
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();
            res.json(users);
        } catch (error) {
            return res.status(500).json({ error: 'Database error' });
        }
    },

    addUser: async (req, res) => {
        const { email, password, type } = req.body;
        try {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser.length > 0) return res.status(400).json({ error: 'Email already exists' });

            const passwordHash = await bcrypt.hash(password, 10);
            await UserModel.createUser(email, passwordHash, type || 'user');
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Database error' });
        }
    },

    updateUser: async (req, res) => {
        const { email, password, type } = req.body;
        const userId = req.params.id;

        try {
            const passwordHash = password ? await bcrypt.hash(password, 10) : null;
            await UserModel.updateUser(userId, email, passwordHash, type);
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Database error' });
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.params.id;
        try {
            await UserModel.deleteUser(userId);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Database error' });
        }
    }
};

module.exports = userController;
