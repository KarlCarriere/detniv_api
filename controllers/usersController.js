"use strict";

const User = require('../models/user');
const Product = require('../models/product');

const dotenv = require('dotenv');
dotenv.config();
const url_base = process.env.URL;


exports.getUsers = (req, res, next) => {
  User.find().select({ name: 1, city: 1 })
  .then(users => {
    if (!users) {
      const error = new Error('Aucun utilisateur trouvé.');
      error.statusCode = 404;
      throw error;
    }
    const usersWithHateoas = users.map(user => {
      return {
        ...user._doc,
        _links: {
          self: {
            href: url_base + "/users/",
            method: "GET"
          },
          user: {
            href: url_base + "/user/" + user._id,
            method: "GET"
          },
        }
      }
    });
    res.status(200).json({
      users: usersWithHateoas
    });
  })
  .catch(err => {
    next(err);
  });
};

exports.getUser = (req, res, next) => {
  const userId =  req.params.userId || req.user.userId;
  User.findById(userId).select({ name: 1, city: 1, cart: 1 })
  .then(user => {
    if (!user) {
      const error = new Error('L\'utilisateur n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      user: user
    });
  })
  .catch(err => {
    next(err);
  });
};

exports.getUserWithEmail = (req, res, next) => {
  const email = req.params.email;
  User.findOne({ email })
  .then(user => {
    if (!user) {
      res.send(false);
    } else {
      res.send(true);
    }
  })
  .catch(err => {
    next(err);
  });
};

exports.followUser = (req, res, next) => {
  const followerId = req.params.userId;
  const userId = req.user.userId;
  User.findById(userId)
  .then(user => {
    if (!user) {
      const error = new Error('L\'utilisateur n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    // if follower already follow user, unfollow him instead
    if (user.followers.includes(followerId)) {
      user.followers.splice(user.followers.indexOf(followerId), 1);
      user.save()
      .then(() => {
        res.status(200).json({ message: "Vous ne suivez plus cet utilisateur" });
      })
      .catch(err => {
        next(err);
      });
    } else {
      user.followers.push(followerId);
      user.save()
      .then(() => {
        res.status(200).json({ message: "Vous suivez cet utilisateur" });
      })
      .catch(err => {
        next(err);
      });
    }
  })
  .catch(err => {
    next(err);
  });
};

exports.getFollowers = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
  .then(user => {
    if (!user) {
      const error = new Error('L\'utilisateur n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      followers: user.followers
    });
  })
  .catch(err => {
    next(err);
  });
};

exports.getCart = (req, res, next) => {
  const userId = req.user.userId;
  User.findById(userId)
  .populate('cart')
  .then(user => {
    if (!user) {
      const error = new Error('L\'utilisateur n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }
    const cartWithHateoas = user.cart.map(item => {
      return {
        item: item,
        _links: {
          self: {
            href: url_base + "/cart/",
            method: "GET"
          },
          product: {
            href: url_base + "/products/" + item._id,
            method: "GET"
          },
          addToCart: {
            href: url_base + "/cart/" + item._id,
            method: "PUT"
          },
          removeFromCart: {
            href: url_base + "/cart/" + item._id,
            method: "DELETE"
          },
        }
      };
    });
    res.status(200).json({
      cart: cartWithHateoas
    });
  })
  .catch(err => {
    next(err);
  });
};

exports.addToCart = (req, res, next) => {
  const userId = req.user.userId;
  const productId = req.params.productId;
  Product.findById(productId)
  .then(product => {
    if (!product || product.isSold) {
      const error = new Error('Le produit n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }

    User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('L\'utilisateur n\'existe pas.');
        error.statusCode = 404;
        throw error;
      }
      user.cart.push(productId);
      user.save()
      .then(() => {
        product.estVendu = true;
        product.save()
        .then((result) => {
          const productWithHateoas = {
            ...result._doc,
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
          res.status(200).json(productWithHateoas);
        })
        .catch(err => {
          next(err);
        });
      })
      .catch(err => {
        next(err);
      });
    })
    .catch(err => {
      next(err);
    });
  })
  .catch(err => {
    next(err);
  });
};


exports.removeProductFromCart = (req, res, next) => {
  const userId = req.user.userId;
  const productId = req.params.productId;

  Product.findById(productId)
  .then(product => {
    if (!product) {
      const error = new Error('Le produit n\'existe pas.');
      error.statusCode = 404;
      throw error;
    }

    User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('L\'utilisateur n\'existe pas.');
        error.statusCode = 404;
        throw error;
      }
      if (user.cart.includes(productId)) {
        user.cart.splice(user.cart.indexOf(productId), 1);
        user.save()
        .then(() => {
          product.estVendu = false;
          product.save()
          .then((result) => {
            const productWithHateoas = {
              ...result._doc,
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
            res.status(204).send(productWithHateoas);
          })
          .catch(err => {
            next(err);
          });
        })
        .catch(err => {
          next(err);
        });
      } else {
        const error = new Error('Le produit n\'est pas dans le panier.');
        error.statusCode = 404;
        throw error;
      }
    })
    .catch(err => {
      next(err);
    });
  })
  .catch(err => {
    next(err);
  });
};