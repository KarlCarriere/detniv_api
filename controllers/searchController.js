"use strict";

const dotenv = require('dotenv');
dotenv.config();
const Product = require('../models/product');
const url_base = process.env.URL;

exports.createSearch = (req, res, next) => {
  let { productSearch } = req.params || null;
  let totalItems
  const currentPage = req.query.page || 1;
  const category = req.query.category || null;
  const perPage = 9;

  let query = "";
  if (productSearch && category){
    if (productSearch === "all") productSearch = "";
      query = { name: { $regex: productSearch, $options: 'i' }, category: category };
    }
  else if (productSearch){
    if (productSearch === "all") productSearch = "";
    query = { name: { $regex: productSearch, $options: 'i' } };
  }
  else if (category)
    query = { category: category };
  else
    query = {};

  // voir https://www.mongodb.com/docs/manual/reference/operator/query/regex/#op._S_regex
  Product.find(query)
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Product.find(query)
        .populate('user')
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
    })
    .then(products => {
      const productsWithHateoas = products.map(product => {
        return {
          ...product._doc,
          _links: {
            self: {
              href: url_base + "/search/" + product._id,
              method: "GET"
            },
            product: {
              href: url_base + "/products/" + product._id,
              method: "GET"
            },
            category: {
              href: url_base + "/categories/" + product.categoryId,
              method: "GET"
            },
            user: {
              href: url_base + "/user/" + product.userId,
              method: "GET"
            },
            addToCart: {
              href: url_base + "/cart/" + product._id,
              method: "PUT"
            },
          }
        }
      });
      res.status(200).json({
        products: productsWithHateoas,
        totalItems: totalItems,
      });
    })
    .catch(err => {
      next(err);
    });
};