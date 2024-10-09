const db = require('../config/db');

const User = {
    // Fonctions pour les utilisateurs
    getAllUsers: () => {
        const sql = `
            SELECT utilisateur.ID_utilisateur, utilisateur.nom, service.Nom AS service, lieux.lieux AS lieux
            FROM utilisateur
            LEFT JOIN service ON utilisateur.ID_service = service.ID_service
            LEFT JOIN lieux ON utilisateur.ID_lieux = lieux.ID_lieux
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    },

    createUser: ({ nom, ID_service, ID_lieux }) => {
        const sql = `
            INSERT INTO utilisateur (nom, ID_service, ID_lieux) 
            VALUES (?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [nom, ID_service, ID_lieux], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.insertId);
            });
        });
    },

    updateUser: ({ id, nom, ID_service, ID_lieux }) => {
        const sql = `
            UPDATE utilisateur 
            SET nom = ?, ID_service = ?, ID_lieux = ? 
            WHERE ID_utilisateur = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [nom, ID_service, ID_lieux, id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    },

    deleteUser: (id) => {
        const sql = `
            DELETE FROM utilisateur 
            WHERE ID_utilisateur = ?
        `;
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    },

    // Fonctions pour les services
    getAllServices: () => {
        const sql = `SELECT * FROM service`;
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    },

    createService: (Nom) => {
        const sql = `INSERT INTO service (Nom) VALUES (?)`;
        return new Promise((resolve, reject) => {
            db.query(sql, [Nom], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.insertId);
            });
        });
    },

    updateService: (id, Nom) => {
        const sql = `UPDATE service SET Nom = ? WHERE ID_service = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [Nom, id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    },

    deleteService: (id) => {
        const sql = `DELETE FROM service WHERE ID_service = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    },

    // Fonctions pour les lieux
    getAllLieux: () => {
        const sql = `SELECT * FROM lieux`;
        return new Promise((resolve, reject) => {
            db.query(sql, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    },

    createLieux: (lieux) => {
        const sql = `INSERT INTO lieux (lieux) VALUES (?)`;
        return new Promise((resolve, reject) => {
            db.query(sql, [lieux], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.insertId);
            });
        });
    },

    updateLieux: (id, lieux) => {
        const sql = `UPDATE lieux SET lieux = ? WHERE ID_lieux = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [lieux, id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    },

    deleteLieux: (id) => {
        const sql = `DELETE FROM lieux WHERE ID_lieux = ?`;
        return new Promise((resolve, reject) => {
            db.query(sql, [id], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    },
};

module.exports = User;
