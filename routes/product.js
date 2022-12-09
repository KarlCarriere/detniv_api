"use strict";

const express = require('express');

const router = express.Router();

const productsController = require('../controllers/productsController');
const isAuth = require('../middleware/is-auth');

/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      required:
 *        - name
 *        - price
 *        - description
 *        - imageUrl
 *        - category
 *        - user
 *        - estVendu
 *      properties:
 *        name:
 *          type: string
 *          description: Le nom du produit
 *        description:
 *          type: string
 *          description: La description du produit
 *        price:
 *          type: number
 *          description: Le prix du produit
 *        imageUrl:
 *          type: string
 *          description: L'image du produit
 *        category:
 *          type: string
 *          description: La catégorie du produit
 *        user:
 *          type: string
 *          description: L'utilisateur qui a créé le produit
 *        estVendu:
 *          type: boolean
 *          description: Le produit est-il vendu ?
 *      example:
 *        id: 60a9b0b0b0b0b0b0b0b0b0b0
 *        name: Table
 *        description: Table IKEA comme neuve
 *        price: 50.00
 *        imageUrl: https://www.ikea.com/ca/fr/images/products/ekedalen-table-basse-blanc__0712009_PE729202_S5.JPG
 *        category: 60a9b0b0b0b0b0b0b0b0b0b0
 *        user: 60a9nfah3bfb54k2oid9
 *        estVendu: false
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: L'API des produits
 */

/**
 * @swagger
 * /products:
 *  get:
 *    summary: Récupère tous les produits
 *    tags: [Products]
 *    responses:
 *      200:
 *        description: The list of products
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 */

// /products/ => GET
router.get('/', productsController.getProducts);


/**
 * @swagger
 * /products/user:
 *  get:
 *    summary: Récupère tous les produits d'un utilisateur
 *    tags: [Products]
 *    responses:
 *      200:
 *        description: The list of products of a user
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 *    security:
 *      - bearerAuth: []
 */

// /products/user => GET
router.get('/user', isAuth, productsController.getProductByUserId);

/**
 * @swagger
 * /products/{id}:
 *  get:
 *    summary: Récupère un produit par son id
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: L'id du produit
 *    responses:
 *      200:
 *        description: Le produit correspondant à l'id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Produit non trouvé
 */

// /products/productId => GET
router.get('/:productId', productsController.getProduct);

/**
 * @swagger
 * /products:
 *  post:
 *    summary: Crée un produit
 *    tags: [Products]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: Le produit a été créé
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      401:
 *        description: Utilisateur non authentifié
 *      500:
 *        description: Erreur serveur
 *    security:
 *      - bearerAuth: []
 */


// /products/ => POST
router.post('/', isAuth, productsController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *    summary: Supprime un produit par son id
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: L'id du produit à supprimer
 *    responses:
 *      200:
 *        description: Le produit a été supprimé
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Produit non trouvé
 *    security:
 *      - bearerAuth: []
 */

// /products/:product => DELETE
router.delete('/:productId', isAuth, productsController.deleteProduct);


module.exports = router;

