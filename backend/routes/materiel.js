const express = require('express');
const router = express.Router();
const db = require('../model/database');

router.post('/', (req, res) => {
    const { code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison } = req.body;
    if (!code || !modele || !marque || !numero_serie || !ID_categorie || !ID_etat || !ID_fournisseur) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations requises' });
    }
    const sqlCheckNumeroSerie = 'SELECT * FROM materiel WHERE numero_serie = ?';
    db.query(sqlCheckNumeroSerie, [numero_serie], (error, results) => {
        if (error) {
            console.error('Erreur lors de la vérification du numéro de série :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Le numéro de série existe déjà.' });
        }
        const sqlInsertMateriel = `
        INSERT INTO materiel (code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
        db.query(
            sqlInsertMateriel,
            [code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison],
            (error, results) => {
                if (error) {
                    console.error('Erreur lors de l\'insertion du matériel :', error);
                    return res.status(500).json({ error: 'Erreur serveur' });
                }
                res.status(201).json({ message: 'Matériel ajouté avec succès', materielId: results.insertId });
            }
        );
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison } = req.body;
    if (!id || !code || !modele || !marque || !numero_serie || !ID_categorie || !ID_etat || !ID_fournisseur) {
        return res.status(400).json({ error: 'Veuillez fournir toutes les informations requises' });
    }
    const sqlCheckNumeroSerie = 'SELECT * FROM materiel WHERE numero_serie = ? AND ID_materiel != ?';
    db.query(sqlCheckNumeroSerie, [numero_serie, id], (error, results) => {
        if (error) {
            console.error('Erreur lors de la vérification du numéro de série :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Le numéro de série existe déjà pour un autre matériel.' });
        }
        const sqlUpdateMateriel = `
            UPDATE materiel
            SET code = ?, modele = ?, marque = ?, numero_serie = ?, numero_inventaire = ?, ID_categorie = ?, ID_etat = ?, ID_fournisseur = ?, bon_de_commande = ?, config = ?, bon_de_livraison = ?
            WHERE ID_materiel = ?
        `;

        db.query(
            sqlUpdateMateriel,
            [code, modele, marque, numero_serie, numero_inventaire, ID_categorie, ID_etat, ID_fournisseur, bon_de_commande, config, bon_de_livraison, id],
            (error, results) => {
                if (error) {
                    console.error('Erreur lors de la mise à jour du matériel :', error);
                    return res.status(500).json({ error: 'Erreur serveur' });
                }
                res.status(200).json({ message: 'Matériel mis à jour avec succès' });
            }
        );
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID du matériel requis' });
    }
    const sqlDeleteMateriel = 'DELETE FROM materiel WHERE ID_materiel = ?';

    db.query(sqlDeleteMateriel, [id], (error, results) => {
        if (error) {
            console.error('Erreur lors de la suppression du matériel :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Matériel non trouvé' });
        }
        res.status(200).json({ message: 'Matériel supprimé avec succès' });
    });
});



router.get('/', (req, res) => {
    const sqlGetMateriel = `
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

    db.query(sqlGetMateriel, (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des matériels :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        res.status(200).json(results);
    });
});

router.get('/non_attribue', (req, res) => {
    const sqlGetMateriel = `
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
LEFT JOIN fournisseur ON materiel.ID_fournisseur = fournisseur.ID_fournisseur
WHERE materiel.attribution = 'non';

    `;

    db.query(sqlGetMateriel, (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des matériels :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        res.status(200).json(results);
    });
});

router.get('/inventaire', (req, res) => {
    const sqlGetMaterielNonAttribue = `
      SELECT code,marque, COUNT(*) AS non_attribue
      FROM materiel
      WHERE attribution = 'non'
      GROUP BY code
    `;

    db.query(sqlGetMaterielNonAttribue, (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des matériels non attribués :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        res.status(200).json(results);
    });
});

router.get('/possibilite', (req, res) => {
    const sqlGet = 'SELECT * FROM possibilite_Materiel';
    db.query(sqlGet, (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des possibilités :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(200).json(results);
    });
});

router.post('/possibilite', (req, res) => {
    const { possibilite_code, possibilite_marque, possibilite_modele } = req.body;
    const sqlCreate = `
        INSERT INTO possibilite_Materiel (possibilite_code, possibilite_marque, possibilite_modele)
        VALUES (?, ?, ?)
    `;
    db.query(sqlCreate, [possibilite_code, possibilite_marque, possibilite_modele], (error, results) => {
        if (error) {
            console.error('Erreur lors de la création de la possibilité :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(201).json({ message: 'Possibilité créée avec succès', id: results.insertId });
    });
});

router.put('/possibilite/:id', (req, res) => {
    const { id } = req.params;
    const { possibilite_code, possibilite_marque, possibilite_modele } = req.body;
    const sqlUpdate = `
        UPDATE possibilite_Materiel
        SET possibilite_code = ?, possibilite_marque = ?, possibilite_modele = ?
        WHERE ID_possibilite = ?
    `;
    db.query(sqlUpdate, [possibilite_code, possibilite_marque, possibilite_modele, id], (error, results) => {
        if (error) {
            console.error('Erreur lors de la mise à jour de la possibilité :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Possibilité non trouvée' });
        }
        res.status(200).json({ message: 'Possibilité mise à jour avec succès' });
    });
});

router.delete('/possibilite/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM possibilite_Materiel WHERE ID_possibilite = ?';
    db.query(sqlDelete, [id], (error, results) => {
        if (error) {
            console.error('Erreur lors de la suppression de la possibilité :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Possibilité non trouvée' });
        }
        res.status(200).json({ message: 'Possibilité supprimée avec succès' });
    });
});

// Route pour récupérer toutes les commandes
router.get('/commandes', (req, res) => {
    const sqlGet = 'SELECT * FROM commande';
    db.query(sqlGet, (error, results) => {
        if (error) {
            console.error('Erreur lors de la récupération des commandes :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(200).json(results);
    });
});

// Route pour créer une nouvelle commande
router.post('/commandes', (req, res) => {
    const { numero_serie, bon_de_commande, bon_de_livraison } = req.body;
    const sqlCreate = 'INSERT INTO commande (numero_serie, bon_de_commande, bon_de_livraison) VALUES (?, ?, ?)';
    db.query(sqlCreate, [numero_serie, bon_de_commande, bon_de_livraison], (error, results) => {
        if (error) {
            console.error('Erreur lors de la création de la commande :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(201).json({ message: 'Commande créée avec succès', id: results.insertId });
    });
});

// Route pour mettre à jour une commande
router.put('/commandes/:id', (req, res) => {
    const { id } = req.params;
    const { numero_serie, bon_de_commande, bon_de_livraison } = req.body;
    const sqlUpdate = 'UPDATE commande SET numero_serie = ?, bon_de_commande = ?, bon_de_livraison = ? WHERE ID_commande = ?';
    db.query(sqlUpdate, [numero_serie, bon_de_commande, bon_de_livraison, id], (error, results) => {
        if (error) {
            console.error('Erreur lors de la mise à jour de la commande :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.status(200).json({ message: 'Commande mise à jour avec succès' });
    });
});

// Route pour supprimer une commande
router.delete('/commandes/:id', (req, res) => {
    const { id } = req.params;
    const sqlDelete = 'DELETE FROM commande WHERE ID_commande = ?';
    db.query(sqlDelete, [id], (error, results) => {
        if (error) {
            console.error('Erreur lors de la suppression de la commande :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.status(200).json({ message: 'Commande supprimée avec succès' });
    });
});

module.exports = router;