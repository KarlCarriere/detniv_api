"use strict";

const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');
const url_base = process.env.URL;

exports.getProducts = (req, res, next) => {
    let totalItems;
    const currentPage = req.query.page || 1;
    const perPage = 9;
    Product.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Product.find()
        .populate('user')
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
    })
    .then(result => {
        const productsWithHateoas = result.map(product => {
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

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findById(productId)
    .populate('user')
    .then(result => {
        console.log(result);
        const productWithHateoas = {
            ...result,
            _links: {
                self: {
                    href: url_base + "/search/" + result._id,
                    method: "GET"
                },
                product: {
                    href: url_base + "/products/" + result._id,
                    method: "GET"
                },
                category: {
                    href: url_base + "/categories/" + result.category,
                    method: "GET"
                },
                user: {
                    href: url_base + "/user/" + result.user._id,
                    method: "GET"
                },
                addToCart: {
                    href: url_base + "/cart/" + result._id,
                    method: "PUT"
                },
            }
        };
        if (!result) {
            const error = new Error('Le produit n\'existe pas.');
            error.statusCode = 404;
            throw error;
        }
        console.log(productWithHateoas);
        res.status(200).json({
            product: productWithHateoas
        });
    })
    .catch(err => {
        next(err);
    });
};

exports.getProductByUserId = (req, res, next) => {
    const userId = req.user.userId;

    Product.find({ user: userId })
    .then(result => {
        const productsWithHateoas = result.map(product => {
            return {
              ...product,
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
        if (!result) {
            const error = new Error('Aucun produit trouvé.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            products: productsWithHateoas
        });
    })
    .catch(err => {
        next(err);
    });
};

exports.createProduct = (req, res, next) => {
    const { titre, description, prix, imageUrl, categorie} = req.body;
    const user = req.user;
    const priceRegex = /^\d+(\.\d{1,2})?$/;

    var errors = [];

    if (titre.length > 50 || titre.length < 1 || titre == null)
        errors.push("Le titre doit contenir entre 1 et 50 caractères.");

    if (description.length > 255 || description.length < 1 || description == null)
        errors.push("La description doit contenir entre 1 et 255 caractères.");

    if (!priceRegex.test(prix)) errors.push("Le prix doit être un nombre décimal.");

    if (imageUrl.length > 255)
        errors.push("L'url de l'image doit contenir au plus 255 caractères.");

    if (imageUrl.length < 1 || imageUrl == null)
        errors.push("L'url de l'image ne doit pas être vide.");

    if (categorie.length < 1 || categorie == null){
        errors.push("La catégorie ne doit pas être vide.");
        return res.status(400).json({errors: errors});
    }

    Category.findById(categorie)
    .then(category => {
        if (!category) errors.push("La catégorie n'existe pas.");
        User.findById(user.userId)
        .then(user => {
            if (!user) errors.push("L'utilisateur n'existe pas.");
            if (errors.length > 0) return res.status(400).json({errors: errors});

            const product = new Product({
                name : titre,
                description : description,
                price : prix,
                imageUrl : imageUrl,
                category : categorie,
                user : user,
                estVendu : false
            });

            product.save()
            .then(result => {
                const productWithHateoas = {
                    ...result,
                    _links: {
                        self: {
                            href: url_base + "/search/" + result._id,
                            method: "GET"
                        },
                        product: {
                            href: url_base + "/products/" + result._id,
                            method: "GET"
                        },
                        category: {
                            href: url_base + "/categories/" + result.categoryId,
                            method: "GET"
                        },
                        user: {
                            href: url_base + "/user/" + result.userId,
                            method: "GET"
                        },
                        addToCart: {
                            href: url_base + "/cart/" + result._id,
                            method: "PUT"
                        },
                    }
                };
                res.status(201).json({
                    message: 'Produit créé avec succès !',
                    product: productWithHateoas
                });
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;

    Product.findByIdAndRemove(productId)
    .then(result => {
        const productWithHateoas = {
            ...result,
            _links: {
                self: {
                    href: url_base + "/search/" + result._id,
                    method: "GET"
                },
                product: {
                    href: url_base + "/products/" + result._id,
                    method: "GET"
                },
                category: {
                    href: url_base + "/categories/" + result.categoryId,
                    method: "GET"
                },
                user: {
                    href: url_base + "/user/" + result.userId,
                    method: "GET"
                },
                addToCart: {
                    href: url_base + "/cart/" + result._id,
                    method: "PUT"
                },
            }
        };
        res.status(200).json({
            message: 'Produit supprimé avec succès !',
            product: productWithHateoas
        });
    })
    .catch(err => {
        next(err);
    });
};