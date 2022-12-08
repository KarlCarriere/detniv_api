"use strict";

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/** Vérifie si la requête a un token JWT valide */

module.exports = (req, res, next) => {
    // Récupération du token dans le header de la requête
    const authHeader = req.get('Authorization');

    // Si le token n'est pas présent dans le header
    if (!authHeader) {
        const error = new Error('Non authentifié');
        error.statusCode = 401;
        throw error;
    }

    // Récupération du token
    const token = authHeader.split(' ')[1];

    // Vérification du token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    }
    catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Non authentifié');
        error.statusCode = 401;
        throw error;
    }

    // Ajout du user à la requête
    req.user = decodedToken;
    next();
};
