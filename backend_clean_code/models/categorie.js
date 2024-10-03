const db = require('../config/db');

const Categorie = {
    getAll: (callback) => {
        const sqlGetCategorie = 'SELECT * FROM categorie';
        db.query(sqlGetCategorie, callback);
    },

    create: (type, callback) => {
        const sqlCreateCategorie = 'INSERT INTO categorie (type) VALUES (?)';
        db.query(sqlCreateCategorie, [type], callback);
    },

    update: (id, type, callback) => {
        const sqlUpdateCategorie = 'UPDATE categorie SET type = ? WHERE ID_categorie = ?';
        db.query(sqlUpdateCategorie, [type, id], callback);
    },

    delete: (id, callback) => {
        const sqlDeleteCategorie = 'DELETE FROM categorie WHERE ID_categorie = ?';
        db.query(sqlDeleteCategorie, [id], callback);
    }
};

module.exports = Categorie;
