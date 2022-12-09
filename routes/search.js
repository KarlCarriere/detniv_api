"use strict";

const express = require('express');

const router = express.Router();

const searchController = require('../controllers/searchController');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Recherche de produits
 */

/**
 * @swagger
 * /search/{productSearch}:
 *  get:
 *    summary: Recherche un produit par son nom et par catégorie
 *    tags: [Search]
 *    parameters:
 *      - in: path
 *        name: productSearch
 *        schema:
 *          type: string
 *        required: true
 *        description: Le nom du produit recherché
 *    responses:
 *      200:
 *        description: Le produit correspondant au nom recherché
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 */
// /search/ => GET
router.get('/search/:productSearch', searchController.createSearch);

module.exports = router;

