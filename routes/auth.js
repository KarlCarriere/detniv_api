"use strict";

const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification
 */

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Authentification d'un utilisateur
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: L'email de l'utilisateur
 *              password:
 *                type: string
 *                description: Le mot de passe de l'utilisateur
 *            example:
 *              email: text@example.com
 *              password: 123456
 *    responses:
 *      200:
 *        description: L'utilisateur a été authentifié
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: Le token de l'utilisateur
 *                user:
 *                  type: object
 *                  description: L'utilisateur authentifié
 *              example:
 *                token: eyJHJKGJKhjksljkldsajklHJKl423jhklszjkl34u2gwkbfdnk76ytbh32jn5
 *                user:
 *                  _id: 5f5f5f5f5f5f5f5f5f5f5f5f,
 *                  email: test@example.com,
 *                  name: Testeur Testant,
 *                  password: gr323qhrt265737w6q4w5tgtbr2q3tag5426345,
 *                  city: Québec,
 *                  cart: []
 *      401:
 *        description: Utilisateur non authentifié
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Le message d'erreur
 *              example:
 *                message: Auth failed
 *      500:
 *        description: Erreur serveur
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Le message d'erreur
 *              example:
 *                message: Server failed
 */

// /auth/login/ => POST
router.post('/login', authController.login);


/**
 * @swagger
 * /auth/signup:
 *  post:
 *    summary: Crée un utilisateur
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Le nom de l'utilisateur
 *              email:
 *                type: string
 *                description: L'email de l'utilisateur
 *              city:
 *                type: string
 *                description: La ville de l'utilisateur
 *              password:
 *                type: string
 *                description: Le mot de passe de l'utilisateur
 *              password_confirmation:
 *                type: string
 *                description: La confirmation du mot de passe de l'utilisateur
 *              example:
 *                name: Testeur Testant
 *                email: test@test.com
 *                city: Québec
 *                password: 123456
 *                password_confirmation: 123456
 *    responses:
 *      200:
 *        description: L'utilisateur a été créé
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Le message de succès
 *              example:
 *                message: User created
 *      500:
 *        description: Erreur serveur
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Le message d'erreur
 *              example:
 *                message: Server failed
 */
// /auth/signup/ => POST
router.post('/signup', authController.signup);


module.exports = router;
