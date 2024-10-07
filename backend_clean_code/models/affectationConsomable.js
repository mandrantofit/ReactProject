// models/affectationConsomable.js
const db = require('../config/db');

const affectationConsomable = {
    // Créer une nouvelle affectation de consommable
    createAffectation: (affectationData) => {
        const { ID_utilisateur, ID_materiel_consomable, quantite_affecter } = affectationData;
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO affectation_consomable (ID_utilisateur, ID_materiel_consomable, quantite_affecter) VALUES (?, ?, ?)',
                [ID_utilisateur, ID_materiel_consomable, quantite_affecter],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results.insertId);
                });
        });
    },

    // Récupérer toutes les affectations de consommables
    getAllAffectations: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT 
                ac.ID_affectation_consomable,
                u.nom AS nom_utilisateur,
                s.nom AS nom_service,
                l.lieux AS lieu,
                mc.modele,
                mc.marque,
                ac.quantite_affecter,
                DATE_FORMAT(ac.date_affectation, '%Y-%m-%d') AS date_affectation  -- Formattage de la date
            FROM 
                affectation_consomable ac
            JOIN 
                utilisateur u ON ac.ID_utilisateur = u.ID_utilisateur
            JOIN 
                service s ON u.ID_service = s.ID_service
            JOIN 
                materiel_consomable mc ON ac.ID_materiel_consomable = mc.ID_materiel_consomable
            JOIN 
                lieux l ON u.ID_lieux = l.ID_lieux;`, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    },

};

module.exports = affectationConsomable;
