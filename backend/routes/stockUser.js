const express = require('express');
const userController = require('../controllers/stockUser');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes pour les utilisateurs
router.get('/',authMiddleware, userController.getAllUsers);
router.post('/',authMiddleware, userController.createUser);
router.put('/:id',authMiddleware, userController.updateUser);
router.delete('/:id',authMiddleware, userController.deleteUser);

// Routes pour les services
router.get('/service',authMiddleware, userController.getAllServices);
router.post('/service',authMiddleware, userController.createService);
router.put('/service/:id',authMiddleware, userController.updateService);
router.delete('/service/:id',authMiddleware, userController.deleteService);

// Routes pour les lieux
router.get('/lieux',authMiddleware, userController.getAllLieux);
router.post('/lieux',authMiddleware, userController.createLieux);
router.put('/lieux/:id',authMiddleware, userController.updateLieux);
router.delete('/lieux/:id',authMiddleware, userController.deleteLieux);

module.exports = router;
