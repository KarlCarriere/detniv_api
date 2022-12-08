"use strict";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const url_base = process.env.URL;

const User = require('../models/user');

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  User.findOne({email: email})
  .then(user =>{
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }
    loadedUser = user;
    console.log('loadedUser', loadedUser);
    return bcrypt.compare(password, user.password);
  })
  .then(isEqual => {
    if (!isEqual) {
      const error = new Error('Mauvais mot de passe !');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        name: loadedUser.name,
        userId: loadedUser._id.toString(),
        city: loadedUser.city,
      },
      process.env.SECRET_JWT,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, user: loadedUser });
  })
  .catch(err =>{
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
  })
};

exports.signup = (req, res, next) => {
  const { email, name, password, password_confirmation, city } = req.body;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  let errors = [];

  console.log(body);

  return res.status(200).json({test: "test", body: req.body});

  if (email.length > 50) errors.push("L'email ne doit pas dépasser 50 caractères");
  if (!emailRegex.test(email)) errors.push("L'email n'est pas valide");
  if (name.length <3 || name.length > 50) errors.push("Le nom doit contenir entre 3 et 50 caractères");
  if (password.length < 6) errors.push("Le mot de passe doit contenir au moins 6 caractères");
  if (password !== password_confirmation) errors.push("Les mots de passe ne correspondent pas");
  if (city.length > 50) errors.push("La ville ne doit pas dépasser 50 caractères");

  User.findOne({ email: email })
    .then(user => {
      if (user) errors.push("Cet email est déjà utilisé");
    })
    .catch(err => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });


  if (errors.length > 0) return res.status(400).json({errors: errors});

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
        city: city,
        cart: [],
      });
      return user.save()
      .then(result => {
        const resultWithHateoas = {
          ...result._doc,
          _links: {
            self: {
              href: url_base + "/auth/signup",
              method: "POST"
            },
            user: {
              href: url_base + "/user/" + result._id,
              method: "GET"
            },
            login: {
              href: url_base + "/auth/login",
              method: "POST"
            }
          }
        };
        res.status(201).json({message: "Utilisateur créé !", user: resultWithHateoas, result: result});
      })
      .catch(err => {
        if (!err.statusCode) err.statusCode = 403;
        next(err);
      });
    })
    .catch(err => {
      next(err);
    });
};