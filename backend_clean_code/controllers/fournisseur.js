const Fournisseur = require('../models/fournisseur');

const fournisseurController = {
    // GET all fournisseurs
    getAllFournisseurs: (req, res) => {
        Fournisseur.getAll((error, results) => {
            if (error) {
                console.error('Erreur lors de la récupération des fournisseurs :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.status(200).json(results);
        });
    },

    // POST a new fournisseur
    createFournisseur: (req, res) => {
        const { nom } = req.body;
        Fournisseur.create(nom, (error, results) => {
            if (error) {
                console.error('Erreur lors de l\'insertion du fournisseur :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.status(201).json({ id: results.insertId, nom });
        });
    },

    // PUT (update) a fournisseur
    updateFournisseur: (req, res) => {
        const { id } = req.params;
        const { nom } = req.body;
        Fournisseur.update(id, nom, (error, results) => {
            if (error) {
                console.error('Erreur lors de la mise à jour du fournisseur :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Fournisseur mis à jour avec succès' });
            } else {
                res.status(404).json({ error: 'Fournisseur non trouvé' });
            }
        });
    },

    // DELETE a fournisseur by ID
    deleteFournisseur: (req, res) => {
        const { id } = req.params;
        Fournisseur.delete(id, (error, results) => {
            if (error) {
                console.error('Erreur lors de la suppression du fournisseur :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Fournisseur supprimé avec succès' });
            } else {
                res.status(404).json({ error: 'Fournisseur non trouvé' });
            }
        });
    }
};

module.exports = fournisseurController;
