// models/userModel.js
const db = require('../config/db'); // Assurez-vous que cela pointe vers votre module de base de données

const UserModel = {
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM log_user WHERE email = ?', [email], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    },

    createUser: (email, passwordHash, type) => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO log_user (email, password_hash, type) VALUES (?, ?, ?)', [email, passwordHash, type], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    },

    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM log_user', (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    },

    updateUser: (id, email, passwordHash, type) => {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE log_user SET email = ?, type = ?';
            const queryParams = [email, type];

            if (passwordHash) {
                query += ', password_hash = ? WHERE ID_logUser = ?';
                queryParams.push(passwordHash, id);
            } else {
                query += ' WHERE ID_logUser = ?';
                queryParams.push(id);
            }

            db.query(query, queryParams, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    },

    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM log_user WHERE ID_logUser = ?', [id], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }
};

module.exports = UserModel;
