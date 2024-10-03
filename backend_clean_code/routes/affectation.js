const express = require('express');
const router = express.Router();
const AffectationController = require('../controllers/affectation');
const authMiddleware = require('../middleware/authMiddleware');

// Définition des routes
router.post('/',authMiddleware, AffectationController.create);
router.delete('/:id',authMiddleware, AffectationController.delete);
router.get('/',authMiddleware, AffectationController.getAll);
router.get('/historique',authMiddleware, AffectationController.getHistorique);
router.put('/:id',authMiddleware, AffectationController.update);

module.exports = router;
