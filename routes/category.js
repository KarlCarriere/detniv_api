"use strict";

const express = require('express');

const router = express.Router();

const categoriesController = require('../controllers/categoriesController');
const isAuth = require('../middleware/is-auth');

// /categories/ => GET
router.get('/', categoriesController.getcategories);

// /categories/categoryId => GET
router.get('/:categoryId', categoriesController.getCategory);

// /categories/ => POST
router.post('/', isAuth, categoriesController.createCategory);

// /categories/:categoryId => DELETE
router.delete('/:categoryId', isAuth, categoriesController.deleteCategory);

module.exports = router;

