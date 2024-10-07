// controllers/consomableController.js
const consomable = require('../models/consomable');

const consomableController = {
    // Récupérer tous les consommables
    getAllConsomables: async (req, res) => {
        try {
            const consomables = await consomable.getAllConsomables();
            res.status(200).json(consomables);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des consommables' });
        }
    },

    // Récupérer un consommable par son ID
    getConsomableById: async (req, res) => {
        const { id } = req.params;
        try {
            const consomableData = await consomable.getConsomableById(id);
            if (consomableData) {
                res.status(200).json(consomableData);
            } else {
                res.status(404).json({ error: 'Consommable non trouvé' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération du consommable' });
        }
    },

    // Créer un nouveau consommable
    createConsomable: async (req, res) => {
        const consomableData = req.body;

        // Vérification des données reçues
        if (!consomableData.numero_inventaire || !consomableData.code || !consomableData.modele || !consomableData.quantite) {
            return res.status(400).json({ error: 'Les champs obligatoires ne sont pas remplis' });
        }

        try {
            const newConsomableId = await consomable.createConsomable(consomableData);
            res.status(201).json({ message: 'Consommable créé avec succès', ID_materiel_consomable: newConsomableId });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la création du consommable' });
        }
    },

    // Mettre à jour un consommable
    updateConsomable: async (req, res) => {
        const { id } = req.params;
        const consomableData = req.body;

        // Vérification des données reçues
        if (!consomableData.numero_inventaire || !consomableData.code || !consomableData.modele || !consomableData.quantite) {
            return res.status(400).json({ error: 'Les champs obligatoires ne sont pas remplis' });
        }

        try {
            const result = await consomable.updateConsomable(id, consomableData);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Consommable non trouvé' });
            }
            res.status(200).json({ message: 'Consommable mis à jour avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour du consommable' });
        }
    },

    // Supprimer un consommable
    deleteConsomable: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await consomable.deleteConsomable(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Consommable non trouvé' });
            }
            res.status(200).json({ message: 'Consommable supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la suppression du consommable' });
        }
    },

    // Mettre à jour la quantité d'un consommable
    updateQuantity: async (req, res) => {
        const { id } = req.params; // Récupérer l'ID du consommable depuis les paramètres de la requête
        const { quantite } = req.body; // Récupérer la nouvelle quantité depuis le corps de la requête

        try {
            // Appeler le modèle pour mettre à jour la quantité
            const result = await consomable.updateQuantity(id, quantite);
            res.status(200).json({ message: 'Quantité mise à jour avec succès.', result });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la quantité:", error);
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité.' });
        }
    }
};

module.exports = consomableController;
