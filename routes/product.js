"use strict";

const express = require('express');

const router = express.Router();

const productsController = require('../controllers/productsController');
const isAuth = require('../middleware/is-auth');

// /products/ => GET
router.get('/', productsController.getProducts);

// /products/user => GET
router.get('/user', isAuth, productsController.getProductByUserId);

// /products/productId => GET
router.get('/:productId', productsController.getProduct);

// /products/ => POST
router.post('/', isAuth, productsController.createProduct);

// /products/:product => DELETE
router.delete('/:productId', isAuth, productsController.deleteProduct);


module.exports = router;

