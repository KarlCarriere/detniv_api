"use strict";

const express = require('express');

const router = express.Router();

const usersController = require('../controllers/usersController');
const isAuth = require('../middleware/is-auth');

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - city
 *      properties:
 *        email:
 *          type: string
 *          description: L'adresse courriel de l'utilisateur
 *        name:
 *          type: string
 *          description: Le nom de l'utilisateur
 *        password:
 *          type: string
 *          description: Le mot de passe de l'utilisateur
 *        city:
 *          type: string
 *          description: La ville de l'utilisateur
 *        cart:
 *          type: array
 *          description: Le panier de l'utilisateur
 *      example:
 *        id: 60a9b0b0b0b0b0b0b0b0b0b0
 *        email: johndoe@example.com
 *        name: John Doe
 *        password: 60a9b0b0b0b0b0b0b0b0b0b0
 *        city: Montréal
 *        cart: []
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour les utilisateurs
 */


/**
 * @swagger
 * /users:
 *  get:
 *    summary: Récupère tous les utilisateurs
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: La liste des utilisateurs
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */

// /users/ => GET
router.get('/users/', usersController.getUsers);

/**
 * @swagger
 * /user:
 *  get:
 *    summary: Récupère un utilisateur
 *    tags: [Users]
 *    responses:
 *      200:
 *       description: L'utilisateur
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *    security:
 *      - bearerAuth: []
 */

// user connected /user/ (profil utilisateur)
router.get('/user/', isAuth, usersController.getUser);

/**
 * @swagger
 * /user/{id}:
 *  get:
 *    summary: Récupère un utilisateur
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: L'id de l'utilisateur
 *    responses:
 *      200:
 *        description: L'utilisateur
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      401:
 *        description: Non autorisé
 *      404:
 *        description: Utilisateur non trouvé
 *      500:
 *        description: Erreur serveur
 */

// /user/:userId => GET
router.get('/user/:userId', usersController.getUser);

/**
 * @swagger
 * /cart:
 *  get:
 *    summary: Récupère le panier d'un utilisateur
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Le panier de l'utilisateur
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 *      401:
 *        description: Non autorisé
 *      500:
 *        description: Erreur serveur
 *    security:
 *      - bearerAuth: []
 */


// get cart => GET
router.get('/cart/', isAuth, usersController.getCart);

/**
 * @swagger
 * /cart/{id}:
 *  put:
 *    summary: Ajoute un produit au panier
 *    tags: [Users]
 *    parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: L'id du produit
 *    responses:
 *      200:
 *        description: Le produit ajouté au panier
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      401:
 *        description: Non autorisé
 *      404:
 *        description: Produit non trouvé
 *      500:
 *        description: Erreur serveur
 *    security:
 *      - bearerAuth: []
 */

// add to cart => PUT
router.put('/cart/:productId', isAuth, usersController.addToCart);

/**
 * @swagger
 * /cart/{id}:
 *  delete:
 *    summary: Supprime un produit du panier
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: L'id du produit
 *    responses:
 *      200:
 *        description: Le produit supprimé du panier
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      401:
 *        description: Non autorisé
 *      404:
 *        description: Produit non trouvé
 *      500:
 *        description: Erreur serveur
 *    security:
 *      - bearerAuth: []
 */

// remove from cart => DELETE
router.delete('/cart/:productId', isAuth, usersController.removeProductFromCart);

module.exports = router;

