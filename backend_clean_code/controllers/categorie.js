const Categorie = require('../models/categorie');

const categorieController = {
    // GET all categories
    getAllCategories: (req, res) => {
        Categorie.getAll((error, results) => {
            if (error) {
                console.error('Erreur lors de la récupération des catégories :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.status(200).json(results);
        });
    },

    // POST create a category
    createCategorie: (req, res) => {
        const { type } = req.body;
        if (!type) {
            return res.status(400).json({ error: 'Le champ type est requis' });
        }

        Categorie.create(type, (error, results) => {
            if (error) {
                console.error('Erreur lors de l\'insertion de la catégorie :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.status(201).json({ id: results.insertId, type });
        });
    },

    // PUT update a category
    updateCategorie: (req, res) => {
        const { id } = req.params;
        const { type } = req.body;
        if (!type) {
            return res.status(400).json({ error: 'Le champ type est requis' });
        }

        Categorie.update(id, type, (error, results) => {
            if (error) {
                console.error('Erreur lors de la mise à jour de la catégorie :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Catégorie mise à jour avec succès' });
            } else {
                res.status(404).json({ error: 'Catégorie non trouvée' });
            }
        });
    },

    // DELETE a category
    deleteCategorie: (req, res) => {
        const { id } = req.params;

        Categorie.delete(id, (error, results) => {
            if (error) {
                console.error('Erreur lors de la suppression de la catégorie :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Catégorie supprimée avec succès' });
            } else {
                res.status(404).json({ error: 'Catégorie non trouvée' });
            }
        });
    }
};

module.exports = categorieController;
