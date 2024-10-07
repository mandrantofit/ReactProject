// models/consomable.js
const db = require('../config/db');

const consomable = {
    // Récupérer tous les consommables
    getAllConsomables: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM materiel_consomable', (error, results) => {
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
        const { numero_inventaire, code, modele, marque, ID_fournisseur, bon_de_commande, config, bon_de_livraison, quantite } = consomableData;
        return new Promise((resolve, reject) => {
            db.query('UPDATE materiel_consomable SET numero_inventaire = ?, code = ?, modele = ?, marque = ?, ID_fournisseur = ?, bon_de_commande = ?, config = ?, bon_de_livraison = ?, quantite = ? WHERE ID_materiel_consomable = ?', 
                [numero_inventaire, code, modele, marque, ID_fournisseur, bon_de_commande, config, bon_de_livraison, quantite, id], 
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
    }
};

module.exports = consomable;
