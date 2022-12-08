"use strict";

const express = require('express');

const router = express.Router();

const usersController = require('../controllers/usersController');
const isAuth = require('../middleware/is-auth');

// /user/ => GET
router.get('/users/', usersController.getUsers);

// user connected /user/ (profil utilisateur)
router.get('/user/', isAuth, usersController.getUser);

// /user/:userId => GET
router.get('/user/:userId', usersController.getUser);

// get cart => GET
router.get('/cart/', isAuth, usersController.getCart);

// add to cart => PUT
router.put('/cart/:productId', isAuth, usersController.addToCart);

// remove from cart => DELETE
router.delete('/cart/:productId', isAuth, usersController.removeProductFromCart);

module.exports = router;

