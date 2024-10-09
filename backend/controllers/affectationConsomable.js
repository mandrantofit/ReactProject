// controllers/affectationConsomableController.js
const affectationConsomableModel = require('../models/affectationConsomable');

const affectationConsomableController = {
    // Créer une nouvelle affectation
    createAffectation: async (req, res) => {
        const { ID_utilisateur, ID_materiel_consomable, quantite_affecter } = req.body; // Récupérer les données de l'affectation depuis le corps de la requête

        try {
            const newAffectationId = await affectationConsomableModel.createAffectation({ ID_utilisateur, ID_materiel_consomable, quantite_affecter });
            res.status(201).json({ message: 'Affectation créée avec succès.', ID: newAffectationId });
        } catch (error) {
            console.error("Erreur lors de la création de l'affectation:", error);
            res.status(500).json({ message: 'Erreur lors de la création de l\'affectation.' });
        }
    },

    // Récupérer toutes les affectations
    getAllAffectations: async (req, res) => {
        try {
            const affectations = await affectationConsomableModel.getAllAffectations();
            res.status(200).json(affectations);
        } catch (error) {
            console.error("Erreur lors de la récupération des affectations:", error);
            res.status(500).json({ message: 'Erreur lors de la récupération des affectations.' });
        }
    },
};

module.exports = affectationConsomableController;
