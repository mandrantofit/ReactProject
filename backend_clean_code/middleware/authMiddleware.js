const jwt = require('jsonwebtoken');
const JWT_SECRET = 'adminplus'; // Assurez-vous que cela correspond à votre clé secrète

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    // Supprimer le mot "Bearer" du token
    const bearerToken = token.split(' ')[1];

    jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        // Stocker les informations décodées dans l'objet requête pour les utiliser dans les routes suivantes
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;
