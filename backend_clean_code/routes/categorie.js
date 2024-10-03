const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorie');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour obtenir toutes les catégories
router.get('/',authMiddleware, categorieController.getAllCategories);

// Route pour créer une nouvelle catégorie
router.post('/',authMiddleware, categorieController.createCategorie);

// Route pour mettre à jour une catégorie existante
router.put('/:id',authMiddleware, categorieController.updateCategorie);

// Route pour supprimer une catégorie
router.delete('/:id',authMiddleware, categorieController.deleteCategorie);

module.exports = router;
