// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', userController.login);
router.get('/', authMiddleware, userController.getAllUsers);
router.post('/ajout', authMiddleware, userController.addUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
