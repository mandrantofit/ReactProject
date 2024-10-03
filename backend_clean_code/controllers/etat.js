const Etat = require('../models/etat');

const etatController = {
    // GET all states
    getAllEtats: (req, res) => {
        Etat.getAll((error, results) => {
            if (error) {
                console.error('Erreur lors de la récupération des états :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            res.status(200).json(results);
        });
    }
};

module.exports = etatController;
