const express = require('express');
const router = express.Router();
const fournisseurController = require('../controllers/fournisseur');
const authMiddleware = require('../middleware/authMiddleware');

// Routes pour gérer les fournisseurs
router.get('/',authMiddleware, fournisseurController.getAllFournisseurs);
router.post('/',authMiddleware, fournisseurController.createFournisseur);
router.put('/:id',authMiddleware, fournisseurController.updateFournisseur);
router.delete('/:id',authMiddleware, fournisseurController.deleteFournisseur);

module.exports = router;
