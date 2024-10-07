// routes/consomableRoutes.js
const express = require('express');
const router = express.Router();
const consomableController = require('../controllers/consomable');
const authMiddleware = require('../middleware/authMiddleware');

// Récupérer tous les consommables
router.get('/', consomableController.getAllConsomables);

// Récupérer un consommable par son ID
router.get('/:id', consomableController.getConsomableById);

// Créer un nouveau consommable
router.post('/', consomableController.createConsomable);

// Mettre à jour un consommable
router.put('/:id', consomableController.updateConsomable);

// Supprimer un consommable
router.delete('/:id', consomableController.deleteConsomable);

module.exports = router;
