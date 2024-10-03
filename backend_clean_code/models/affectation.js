const db = require('../config/db');

const Affectation = {
    create: (data, callback) => {
        const { ID_utilisateur, ID_materiel } = data;

        const sqlUpdateMateriel = 'UPDATE materiel SET attribution = ? WHERE ID_materiel = ?';
        const sqlInsertAffectation = 'INSERT INTO affectation (ID_utilisateur, ID_materiel) VALUES (?, ?)';

        db.query(sqlUpdateMateriel, ['oui', ID_materiel], (error) => {
            if (error) {
                return callback(new Error('Erreur lors de la mise à jour du matériel: ' + error.message));
            }

            db.query(sqlInsertAffectation, [ID_utilisateur, ID_materiel], (error) => {
                if (error) {
                    return callback(new Error('Erreur lors de la création de l\'affectation: ' + error.message));
                }
                callback(null, { message: 'Affectation créée avec succès' });
            });
        });
    },

    delete: (id, callback) => {
        const sqlSelectMateriel = 'SELECT ID_materiel FROM affectation WHERE ID_affectation = ?';
        const sqlUpdateMateriel = 'UPDATE materiel SET attribution = ? WHERE ID_materiel = ?';
        const sqlDeleteAffectation = 'DELETE FROM affectation WHERE ID_affectation = ?';

        db.query(sqlSelectMateriel, [id], (error, result) => {
            if (error) {
                return callback(new Error('Erreur lors de la recherche de l\'affectation: ' + error.message));
            }

            if (result.length === 0) {
                return callback(new Error('Affectation non trouvée'));
            }

            const ID_materiel = result[0].ID_materiel;

            db.query(sqlUpdateMateriel, ['non', ID_materiel], (error) => {
                if (error) {
                    return callback(new Error('Erreur lors de la mise à jour du matériel: ' + error.message));
                }

                db.query(sqlDeleteAffectation, [id], (error) => {
                    if (error) {
                        return callback(new Error('Erreur lors de la suppression de l\'affectation: ' + error.message));
                    }
                    callback(null, { message: 'Affectation supprimée avec succès' });
                });
            });
        });
    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            const sqlGetAffectation = `
                SELECT a.ID_affectation, a.ID_materiel, a.ID_utilisateur, a.date_affectation, 
                       COALESCE(m.numero_inventaire, 'N/A') AS numero_inventaire, 
                       CONCAT(m.marque, ' - ', m.modele) AS modele,
                       CONCAT(u.nom, ' - ', s.Nom, ' - ', l.lieux) AS utilisateur_nom
                FROM affectation a
                JOIN materiel m ON a.ID_materiel = m.ID_materiel
                JOIN utilisateur u ON a.ID_utilisateur = u.ID_utilisateur
                LEFT JOIN service s ON u.ID_service = s.ID_service
                LEFT JOIN lieux l ON u.ID_lieux = l.ID_lieux;
            `;

            db.query(sqlGetAffectation, (error, results) => {
                if (error) {
                    return reject(new Error('Erreur lors de la récupération des affectations: ' + error.message));
                }
                resolve(results);
            });
        });
    },

    getHistorique: () => {
        return new Promise((resolve, reject) => {
            const sqlGetHistorique = `
                SELECT h.ID_historique, h.ID_affectation, h.ID_materiel, h.ID_utilisateur, 
                       h.date_affectation, h.date_suppression, 
                       COALESCE(m.numero_inventaire, 'N/A') AS numero_inventaire, 
                       CONCAT(m.marque, ' - ', m.modele) AS modele,
                       CONCAT(u.nom, ' - ', s.Nom, ' - ', l.lieux) AS utilisateur_nom
                FROM historique h
                JOIN materiel m ON h.ID_materiel = m.ID_materiel
                JOIN utilisateur u ON h.ID_utilisateur = u.ID_utilisateur
                LEFT JOIN service s ON u.ID_service = s.ID_service
                LEFT JOIN lieux l ON u.ID_lieux = l.ID_lieux;
            `;

            db.query(sqlGetHistorique, (error, results) => {
                if (error) {
                    return reject(new Error('Erreur lors de la récupération de l\'historique des affectations: ' + error.message));
                }
                resolve(results);
            });
        });
    },

    update: (id, data, callback) => {
        const { ID_utilisateur, ID_materiel } = data;

        const sqlSelectAffectation = 'SELECT * FROM affectation WHERE ID_affectation = ?';
        const sqlUpdateAffectation = 'UPDATE affectation SET ID_utilisateur = ?, ID_materiel = ? WHERE ID_affectation = ?';

        db.query(sqlSelectAffectation, [id], (error, affectation) => {
            if (error) {
                return callback(new Error('Erreur lors de la recherche de l\'affectation: ' + error.message));
            }

            if (affectation.length === 0) {
                return callback(new Error('Affectation non trouvée'));
            }

            // Vérifier l'attribution précédente
            if (affectation[0].ID_materiel !== ID_materiel) {
                db.query('UPDATE materiel SET attribution = ? WHERE ID_materiel = ?', ['non', affectation[0].ID_materiel], (error) => {
                    if (error) {
                        return callback(new Error('Erreur lors de la mise à jour du matériel: ' + error.message));
                    }
                    db.query('UPDATE materiel SET attribution = ? WHERE ID_materiel = ?', ['oui', ID_materiel], (error) => {
                        if (error) {
                            return callback(new Error('Erreur lors de la mise à jour du matériel: ' + error.message));
                        }

                        db.query(sqlUpdateAffectation, [ID_utilisateur, ID_materiel, id], callback);
                    });
                });
            } else {
                db.query(sqlUpdateAffectation, [ID_utilisateur, ID_materiel, id], callback);
            }
        });
    }
};

module.exports = Affectation;
