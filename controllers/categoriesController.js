"use strict";

const dotenv = require('dotenv');
const Category = require('../models/category');
const Product = require('../models/product');

dotenv.config();
const url_base = process.env.URL + ":" + process.env.PORT;

exports.getcategories = (req, res, next) => {
  Category.find()
  .then(categories => {
    if (!categories) {
      const error = new Error('Aucune catégorie trouvée.');
      error.statusCode = 404;
      throw error;
    }
    const categoriesWithHateoas = categories.map(category => {
      return {
        ...category._doc,
        _links: {
          self: {
            href: url_base + "/categories/",
            method: "GET"
          },
          category: {
            href: url_base + "/categories/" + category._id,
            method: "GET"
          },
          delete: {
            href: url_base + "/categories/" + category._id,
            method: "DELETE"
          },
        }
      }
    });
    res.status(200).json({
      categories: categoriesWithHateoas
    });
  })
  .catch(err => {
    next(err);
  });
};

exports.getCategory = (req, res, next) => {
  const CategoryId = req.params.categoryId;

  Category.findById(CategoryId)
  .then(category => {
    if (!category) {
      const error = new Error('Le catégorie n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    const categoryWithHateoas = {
      ...category._doc,
      _links: {
        self: {
          href: url_base + "/categories/" + category._id,
          method: "GET"
        },
        delete: {
          href: url_base + "/categories/" + category._id,
          method: "DELETE"
        },
      }
    };
    res.status(200).json({
      category: categoryWithHateoas
    });
  })
  .catch(err => {
    next(err);
  });
};

exports.createCategory = (req, res, next) => {
  const nom = req.body.nom;
  const categorieParente = req.body.categorieParente;

  const category = new Category({
    nom: nom,
    categorieParente: categorieParente
  });

  category.save()
  .then(result => {
    res.status(201).json({
      message: 'Catégorie créée !',
      category: category
    });
  })
  .catch(err => {
    next(err);
  });
};

exports.deleteCategory = (req, res, next) => {
  const CategoryId = req.params.categoryId;

  Category.findById(CategoryId)
  .then(category => {
    if (!category) {
      const error = new Error('La catégorie n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    return Category.findByIdAndRemove(CategoryId);
  })
  .then(result => {
    return Product.deleteOne({ category: CategoryId });
  })
  .then(result => {
    res.status(200).json({ message: 'Catégorie supprimée !' });
  })
  .catch(err => {
    next(err);
  });
};