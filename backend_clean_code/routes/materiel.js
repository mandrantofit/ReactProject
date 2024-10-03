const express = require('express');
const router = express.Router();
const materiel = require('../controllers/materiel');
const authMiddleware = require('../middleware/authMiddleware');

// Routes pour les matériels
router.post('/',authMiddleware, materiel.create);
router.put('/:id',authMiddleware, materiel.update);
router.delete('/:id',authMiddleware, materiel.delete);
router.get('/',authMiddleware, materiel.getAll);
router.get('/inventaire',authMiddleware, materiel.afficherStock);
router.get('/non_attribue',authMiddleware, materiel.getNonAttribue);

// Routes pour les fiches de matériel
router.get('/possibilite',authMiddleware, materiel.getPossibilites);
router.post('/possibilite',authMiddleware, materiel.createPossibilite);
router.put('/possibilite/:id',authMiddleware, materiel.updatePossibilite);
router.delete('/possibilite/:id',authMiddleware, materiel.deletePossibilite);

// Routes pour les commandes
router.get('/commandes',authMiddleware, materiel.getCommandes);
router.post('/commandes',authMiddleware, materiel.createCommande);
router.put('/commandes/:id',authMiddleware, materiel.updateCommande);
router.delete('/commandes/:id',authMiddleware, materiel.deleteCommande);


module.exports = router;
