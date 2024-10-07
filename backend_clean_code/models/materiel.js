const db = require('../config/db');

const Materiel = {
    create: (data, callback) => {
        const sql = `
            INSERT INTO materiel 
            (code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, data, callback);
    },

    afficherStock: (callback) => {
        const sql = `
      SELECT code,marque,modele, COUNT(*) AS non_attribue
      FROM materiel
      WHERE attribution = 'non'
      GROUP BY code
    `;
        db.query(sql, callback);
    },

    update: (id, data, callback) => {
        const sql = `
            UPDATE materiel 
            SET code = ?, modele = ?, marque = ?, numero_serie = ?, numero_inventaire = ?, ID_categorie = ?, ID_etat = ?, ID_fournisseur = ?, bon_de_commande = ?, config = ?, bon_de_livraison = ?
            WHERE ID_materiel = ?
        `;
        db.query(sql, [...data, id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM materiel WHERE ID_materiel = ?';
        db.query(sql, [id], callback);
    },

    findAll: (callback) => {
        const sql = `
      SELECT 
    materiel.ID_materiel,
    materiel.code,
    materiel.modele,
    materiel.marque,
    materiel.numero_serie,
    CASE 
        WHEN materiel.numero_inventaire IS NULL OR materiel.numero_inventaire = '' THEN 'N/A' 
        ELSE materiel.numero_inventaire 
    END AS numero_inventaire,
    categorie.type AS type,
    etat.description AS etat,
    fournisseur.nom AS fournisseur,
    materiel.bon_de_commande,
    materiel.config,
    materiel.bon_de_livraison,
    materiel.attribution
FROM materiel
LEFT JOIN categorie ON materiel.ID_categorie = categorie.ID_categorie
LEFT JOIN etat ON materiel.ID_etat = etat.ID_etat
LEFT JOIN fournisseur ON materiel.ID_fournisseur = fournisseur.ID_fournisseur;
    `;
        db.query(sql, callback);
    },

    findNonAttribue: (callback) => {
        const sql = `
            SELECT materiel.ID_materiel, materiel.code, materiel.modele, materiel.marque, materiel.numero_serie,
                   IFNULL(materiel.numero_inventaire, 'N/A') AS numero_inventaire,
                   categorie.type AS type, etat.description AS etat, fournisseur.nom AS fournisseur,
                   materiel.bon_de_commande, materiel.config, materiel.bon_de_livraison, materiel.attribution
            FROM materiel
            LEFT JOIN categorie ON materiel.ID_categorie = categorie.ID_categorie
            LEFT JOIN etat ON materiel.ID_etat = etat.ID_etat
            LEFT JOIN fournisseur ON materiel.ID_fournisseur = fournisseur.ID_fournisseur
            WHERE materiel.attribution = 'non'
        `;
        db.query(sql, callback);
    },

    getPossibilites: (callback) => {
        const sqlGet = 'SELECT * FROM possibilite_Materiel';
        db.query(sqlGet, (error, results) => {
            if (error) {
                console.error('Erreur lors de la récupération des possibilités :', error);
                return callback(error, null);
            }
            callback(null, results);
        });
    },

    createPossibilite: (possibilite, callback) => {
        const { possibilite_code, possibilite_marque, possibilite_modele } = possibilite;
        const sqlCreate = `
            INSERT INTO possibilite_Materiel (possibilite_code, possibilite_marque, possibilite_modele)
            VALUES (?, ?, ?)
        `;
        db.query(sqlCreate, [possibilite_code, possibilite_marque, possibilite_modele], (error, results) => {
            if (error) {
                console.error('Erreur lors de la création de la possibilité :', error);
                return callback(error, null);
            }
            callback(null, { message: 'Possibilité créée avec succès', id: results.insertId });
        });
    },

    updatePossibilite: (id, possibilite, callback) => {
        const { possibilite_code, possibilite_marque, possibilite_modele } = possibilite;
        const sqlUpdate = `
            UPDATE possibilite_Materiel
            SET possibilite_code = ?, possibilite_marque = ?, possibilite_modele = ?
            WHERE ID_possibilite = ?
        `;
        db.query(sqlUpdate, [possibilite_code, possibilite_marque, possibilite_modele, id], (error, results) => {
            if (error) {
                console.error('Erreur lors de la mise à jour de la possibilité :', error);
                return callback(error, null);
            }
            if (results.affectedRows === 0) {
                return callback(new Error('Possibilité non trouvée'), null);
            }
            callback(null, { message: 'Possibilité mise à jour avec succès' });
        });
    },

    deletePossibilite: (id, callback) => {
        const sqlDelete = 'DELETE FROM possibilite_Materiel WHERE ID_possibilite = ?';
        db.query(sqlDelete, [id], (error, results) => {
            if (error) {
                console.error('Erreur lors de la suppression de la possibilité :', error);
                return callback(error, null);
            }
            if (results.affectedRows === 0) {
                return callback(new Error('Possibilité non trouvée'), null);
            }
            callback(null, { message: 'Possibilité supprimée avec succès' });
        });
    },

    getCommandes: (callback) => {
        const sqlGet = 'SELECT * FROM commande';
        db.query(sqlGet, (error, results) => {
            if (error) {
                console.error('Erreur lors de la récupération des commandes :', error);
                return callback(error, null);
            }
            callback(null, results);
        });
    },

    createCommande: (commande, callback) => {
        const { numero_serie, bon_de_commande, bon_de_livraison } = commande;
        const sqlCreate = 'INSERT INTO commande (numero_serie, bon_de_commande, bon_de_livraison) VALUES (?, ?, ?)';
        db.query(sqlCreate, [numero_serie, bon_de_commande, bon_de_livraison], (error, results) => {
            if (error) {
                console.error('Erreur lors de la création de la commande :', error);
                return callback(error, null);
            }
            callback(null, { message: 'Commande créée avec succès', id: results.insertId });
        });
    },

    updateCommande: (id, commande, callback) => {
        const { numero_serie, bon_de_commande, bon_de_livraison } = commande;
        const sqlUpdate = 'UPDATE commande SET numero_serie = ?, bon_de_commande = ?, bon_de_livraison = ? WHERE ID_commande = ?';
        db.query(sqlUpdate, [numero_serie, bon_de_commande, bon_de_livraison, id], (error, results) => {
            if (error) {
                console.error('Erreur lors de la mise à jour de la commande :', error);
                return callback(error, null);
            }
            if (results.affectedRows === 0) {
                return callback(new Error('Commande non trouvée'), null);
            }
            callback(null, { message: 'Commande mise à jour avec succès' });
        });
    },

    deleteCommande: (id, callback) => {
        const sqlDelete = 'DELETE FROM commande WHERE ID_commande = ?';
        db.query(sqlDelete, [id], (error, results) => {
            if (error) {
                console.error('Erreur lors de la suppression de la commande :', error);
                return callback(error, null);
            }
            if (results.affectedRows === 0) {
                return callback(new Error('Commande non trouvée'), null);
            }
            callback(null, { message: 'Commande supprimée avec succès' });
        });
    },
};

module.exports = Materiel;