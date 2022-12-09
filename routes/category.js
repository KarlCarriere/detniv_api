"use strict";

const express = require('express');

const router = express.Router();

const categoriesController = require('../controllers/categoriesController');
const isAuth = require('../middleware/is-auth');

/**
 * @swagger
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: Le nom de la catégorie
 *        parentId:
 *          type: string
 *          description: L'id de la catégorie parente
 *      example:
 *        id: 60a9b0b0b0b0b0b0b0b0b0b0
 *        name: Vêtements
 *        parentId: 60a9b0b0b0b0b0b0b0b0b0b0
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API pour les catégories
 */

/**
 * @swagger
 * /categories:
 *  get:
 *    summary: Récupère toutes les catégories
 *    tags: [Categories]
 *    responses:
 *      200:
 *        description: La liste des catégories
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Category'
 */

// /categories/ => GET
router.get('/', categoriesController.getcategories);


/**
 * @swagger
 * /categories/{id}:
 *  get:
 *    summary: Récupère une catégorie par son id
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: L'id de la catégorie
 *    responses:
 *      200:
 *        description: La catégorie
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      404:
 *        description: La catégorie n'existe pas
 *      500:
 *        description: Erreur serveur
 */

// /categories/categoryId => GET
router.get('/:categoryId', categoriesController.getCategory);

/**
 * @swagger
 * /categories:
 *  post:
 *    summary: Créer une catégorie
 *    tags: [Categories]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *      200:
 *        description: La catégorie a été créée
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Category'
 *      401:
 *        description: Utilisateur non authentifié
 *      500:
 *        description: Erreur serveur
 */
// /categories/ => POST
router.post('/', isAuth, categoriesController.createCategory);


/**
 * @swagger
 * /categories/{id}:
 *  delete:
 *    summary: Supprime une catégorie
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: L'id de la catégorie
 *    responses:
 *      200:
 *        description: La catégorie a été supprimée
 *      401:
 *        description: Utilisateur non authentifié
 *      500:
 *        description: Erreur serveur
 *      404:
 *        description: La catégorie n'existe pas
 */
// /categories/:categoryId => DELETE
router.delete('/:categoryId', isAuth, categoriesController.deleteCategory);

module.exports = router;

