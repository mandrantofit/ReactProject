const db = require('../config/db');

const Etat = {
    getAll: (callback) => {
        const sqlGetEtat = 'SELECT * FROM etat';
        db.query(sqlGetEtat, callback);
    }
};

module.exports = Etat;
