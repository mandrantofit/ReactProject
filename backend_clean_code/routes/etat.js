const express = require('express');
const router = express.Router();
const etatController = require('../controllers/etat');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour obtenir tous les états
router.get('/',authMiddleware, etatController.getAllEtats);

module.exports = router;
