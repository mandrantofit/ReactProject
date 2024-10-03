const User = require('../models/stockUser');

const userController = {
    // Contrôleurs pour les utilisateurs
    getAllUsers: async (req, res) => {
        try {
            const users = await User.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    createUser: async (req, res) => {
        try {
            const { nom, ID_service, ID_lieux } = req.body;
            const userId = await User.createUser({ nom, ID_service, ID_lieux });
            res.status(201).json({ message: 'Utilisateur créé', ID_utilisateur: userId });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { nom, ID_service, ID_lieux } = req.body;
            const result = await User.updateUser({ id, nom, ID_service, ID_lieux });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.status(200).json({ message: 'Utilisateur mis à jour' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await User.deleteUser(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.status(200).json({ message: 'Utilisateur supprimé' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    // Contrôleurs pour les services
    getAllServices: async (req, res) => {
        try {
            const services = await User.getAllServices();
            res.status(200).json(services);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    createService: async (req, res) => {
        try {
            const { Nom } = req.body;
            const serviceId = await User.createService(Nom);
            res.status(201).json({ message: 'Service créé', ID_service: serviceId });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    updateService: async (req, res) => {
        try {
            const { id } = req.params;
            const { Nom } = req.body;
            const result = await User.updateService(id, Nom);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Service non trouvé' });
            }
            res.status(200).json({ message: 'Service mis à jour' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    deleteService: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await User.deleteService(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Service non trouvé' });
            }
            res.status(200).json({ message: 'Service supprimé' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    // Contrôleurs pour les lieux
    getAllLieux: async (req, res) => {
        try {
            const lieux = await User.getAllLieux();
            res.status(200).json(lieux);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    createLieux: async (req, res) => {
        try {
            const { lieux } = req.body;
            const lieuxId = await User.createLieux(lieux);
            res.status(201).json({ message: 'Lieux créé', ID_lieux: lieuxId });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    updateLieux: async (req, res) => {
        try {
            const { id } = req.params;
            const { lieux } = req.body;
            const result = await User.updateLieux(id, lieux);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Lieux non trouvé' });
            }
            res.status(200).json({ message: 'Lieux mis à jour' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    deleteLieux: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await User.deleteLieux(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Lieux non trouvé' });
            }
            res.status(200).json({ message: 'Lieux supprimé' });
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },
};

module.exports = userController;
