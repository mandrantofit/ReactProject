// models/consomable.js
const db = require('../config/db');

const consomable = {
    // Récupérer tous les consommables
    getAllConsomables: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
    mc.ID_materiel_consomable,
    mc.numero_inventaire,
    mc.code,
    mc.modele,
    mc.marque,
    mc.bon_de_commande,
    mc.config,
    mc.bon_de_livraison,
    mc.quantite,
    f.nom AS fournisseur
FROM 
    materiel_consomable mc
LEFT JOIN 
    fournisseur f ON mc.ID_fournisseur = f.ID_fournisseur;
`, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    },

    // Récupérer un consommable par son ID
    getConsomableById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM materiel_consomable WHERE ID_materiel_consomable = ?', [id], (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });
    },

    // Créer un nouveau consommable
    createConsomable: (consomableData) => {
        const { numero_inventaire, code, modele, marque, ID_fournisseur, bon_de_commande, config, bon_de_livraison, quantite } = consomableData;
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO materiel_consomable (numero_inventaire, code, modele, marque, ID_fournisseur, bon_de_commande, config, bon_de_livraison, quantite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [numero_inventaire, code, modele, marque, ID_fournisseur, bon_de_commande, config, bon_de_livraison, quantite],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results.insertId);
                });
        });
    },

    // Mettre à jour un consommable
    updateConsomable: (id, consomableData) => {
        const { numero_inventaire, code, modele, marque, ID_fournisseur, bon_de_commande, config, bon_de_livraison } = consomableData;
        return new Promise((resolve, reject) => {
            db.query('UPDATE materiel_consomable SET numero_inventaire = ?, code = ?, modele = ?, marque = ?, ID_fournisseur = ?, bon_de_commande = ?, config = ?, bon_de_livraison = ? WHERE ID_materiel_consomable = ?',
                [numero_inventaire, code, modele, marque, ID_fournisseur, bon_de_commande, config, bon_de_livraison, id],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
        });
    },

    // Supprimer un consommable
    deleteConsomable: (id) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM materiel_consomable WHERE ID_materiel_consomable = ?', [id], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    },

    updateQuantity: (id, quantite) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE materiel_consomable SET quantite = quantite+? WHERE ID_materiel_consomable = ?', 
                [quantite, id], 
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
        });
    }
};

module.exports = consomable;
