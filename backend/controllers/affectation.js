const Affectation = require('../models/affectation');
const { format } = require('date-fns'); // Assurez-vous d'importer format depuis date-fns

const formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
};

const AffectationController = {
    create: async (req, res) => {
        const { ID_utilisateur, ID_materiel } = req.body;

        try {
            await new Promise((resolve, reject) => {
                Affectation.create({ ID_utilisateur, ID_materiel }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
            });
            res.status(201).json({ message: 'Affectation créée avec succès' });
        } catch (error) {
            console.error('Erreur lors de la création de l\'affectation:', error);
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;

        try {
            const result = await new Promise((resolve, reject) => {
                Affectation.delete(id, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
            });
            res.status(200).json(result);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'affectation:', error);
            res.status(500).json({ error: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const results = await Affectation.getAll(); // Attendre que la promesse soit résolue
            const formattedResults = results.map(result => ({
                ...result,
                date_affectation: formatDate(result.date_affectation) // Formater la date
            }));

            res.status(200).json(formattedResults);
        } catch (error) {
            console.error('Erreur lors de la récupération des affectations :', error);
            res.status(500).json({ error: error.message });
        }
    },

    getHistorique: async (req, res) => {
        try {
            const results = await Affectation.getHistorique(); // Changer ici pour retourner une promesse
            const formattedResults = results.map(result => ({
                ...result,
                date_affectation: formatDate(result.date_affectation),
                date_suppression: formatDate(result.date_suppression)
            }));

            res.status(200).json(formattedResults);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des affectations :', error);
            res.status(500).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { ID_utilisateur, ID_materiel } = req.body;

        try {
            await new Promise((resolve, reject) => {
                Affectation.update(id, { ID_utilisateur, ID_materiel }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
            });
            res.status(200).json({ message: 'Affectation mise à jour avec succès' });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'affectation:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = AffectationController;
