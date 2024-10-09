const Materiel = require('../models/materiel');

const materielController = {
    create: (req, res) => {
        const { code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison } = req.body;

        if (!code || !modele || !marque || !numero_serie || !ID_categorie || !ID_etat || !ID_fournisseur) {
            return res.status(400).json({ error: 'Veuillez fournir toutes les informations requises' });
        }
        Materiel.create([code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison], (error, results) => {
            if (error) return res.status(500).json({ error: 'Erreur lors de l\'insertion du matériel' });
            res.status(201).json({ message: 'Matériel ajouté avec succès', materielId: results.insertId });
        });
    },

    update: (req, res) => {
        const { id } = req.params;
        const { code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison } = req.body;

        if (!id || !code || !modele || !marque || !numero_serie || !ID_categorie || !ID_etat || !ID_fournisseur) {
            return res.status(400).json({ error: 'Veuillez fournir toutes les informations requises' });
        }
        Materiel.update(id, [code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison], (error, results) => {
            if (error) return res.status(500).json({ error: 'Erreur lors de la mise à jour du matériel' });
            res.status(200).json({ message: 'Matériel mis à jour avec succès' });
        });
    },

    delete: (req, res) => {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID du matériel requis' });

        Materiel.delete(id, (error, results) => {
            if (error) return res.status(500).json({ error: 'Erreur lors de la suppression du matériel' });
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Matériel non trouvé' });
            res.status(200).json({ message: 'Matériel supprimé avec succès' });
        });
    },

    getAll: (req, res) => {
        Materiel.findAll((error, results) => {
            if (error) return res.status(500).json({ error: 'Erreur lors de la récupération des matériels' });
            res.status(200).json(results);
        });
    },

    afficherStock: (req, res) => {
        Materiel.afficherStock((error, results) => {
            if (error) return res.status(500).json({ error: 'Erreur lors de la récupération des stock' });
            res.status(200).json(results);
        });
    },

    getNonAttribue: (req, res) => {
        Materiel.findNonAttribue((error, results) => {
            if (error) return res.status(500).json({ error: 'Erreur lors de la récupération des matériels non attribués' });
            res.status(200).json(results);
        });
    },

    getPossibilites: (req, res) => {
        Materiel.getPossibilites((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Erreur serveur lors de la récupération des possibilités' });
            }
            res.status(200).json(results);
        });
    },

    createPossibilite: (req, res) => {
        const possibilite = req.body;
        Materiel.createPossibilite(possibilite, (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(201).json(result);
        });
    },

    updatePossibilite: (req, res) => {
        const { id } = req.params;
        const possibilite = req.body;
        Materiel.updatePossibilite(id, possibilite, (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json(result);
        });
    },

    deletePossibilite: (req, res) => {
        const { id } = req.params;
        Materiel.deletePossibilite(id, (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json(result);
        });
    },

    getCommandes: (req, res) => {
        Materiel.getCommandes((error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Erreur serveur lors de la récupération des commandes' });
            }
            res.status(200).json(results);
        });
    },

    createCommande: (req, res) => {
        const commande = req.body;
        Materiel.createCommande(commande, (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(201).json(result);
        });
    },

    updateCommande: (req, res) => {
        const { id } = req.params;
        const commande = req.body;
        Materiel.updateCommande(id, commande, (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json(result);
        });
    },

    deleteCommande: (req, res) => {
        const { id } = req.params;
        Materiel.deleteCommande(id, (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json(result);
        });
    },
};

module.exports = materielController;
