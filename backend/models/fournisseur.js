const db = require('../config/db');

const Fournisseur = {
    getAll: (callback) => {
        const sqlGetFournisseur = 'SELECT * FROM fournisseur';
        db.query(sqlGetFournisseur, callback);
    },
    create: (nom, callback) => {
        const sqlCreateFournisseur = 'INSERT INTO fournisseur (nom) VALUES (?)';
        db.query(sqlCreateFournisseur, [nom], callback);
    },
    update: (id, nom, callback) => {
        const sqlUpdateFournisseur = 'UPDATE fournisseur SET nom = ? WHERE ID_fournisseur = ?';
        db.query(sqlUpdateFournisseur, [nom, id], callback);
    },
    delete: (id, callback) => {
        const sqlDeleteFournisseur = 'DELETE FROM fournisseur WHERE ID_fournisseur = ?';
        db.query(sqlDeleteFournisseur, [id], callback);
    }
};

module.exports = Fournisseur;
