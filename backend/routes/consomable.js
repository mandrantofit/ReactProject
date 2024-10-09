// routes/consomableRoutes.js
const express = require('express');
const router = express.Router();
const consomableController = require('../controllers/consomable');


const authMiddleware = require('../middleware/authMiddleware');

// Récupérer tous les consommables
router.get('/',authMiddleware, consomableController.getAllConsomables);

// Récupérer un consommable par son ID
router.get('/:id',authMiddleware, consomableController.getConsomableById);

// Créer un nouveau consommable
router.post('/',authMiddleware, consomableController.createConsomable);

// Mettre à jour un consommable
router.put('/:id',authMiddleware, consomableController.updateConsomable);

// Supprimer un consommable
router.delete('/:id',authMiddleware, consomableController.deleteConsomable);

router.put('/quantity/:id',authMiddleware, consomableController.updateQuantity);

module.exports = router;
