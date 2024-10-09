// routes/affectationConsomableRoutes.js
const express = require('express');
const router = express.Router();
const affectationConsomableController = require('../controllers/affectationConsomable');
const authMiddleware = require('../middleware/authMiddleware');
// Créer une nouvelle affectation
router.post('/',authMiddleware, affectationConsomableController.createAffectation);

// Récupérer toutes les affectations
router.get('/',authMiddleware, affectationConsomableController.getAllAffectations);

module.exports = router;
