"use strict";

const express = require('express');
const mongoose = require('mongoose');
var hateoasLinker = require('express-hateoas-links');
const app = express();

app.use(express.json());

app.use(hateoasLinker);


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const errorController = require('./controllers/error');

const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');


app.use('/auth', authRoutes);
app.use(searchRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use(userRoutes);

app.get('/favicon.ico', (req, res) => res.status(204));

app.use(errorController.get404);

app.use(function (err, req, res, next) {
  console.log('err', err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});


const PORT = 3000;
mongoose
  .connect('mongodb://127.0.0.1:27017/detniv')
  .then(() => {
    app.listen(3000, () => {
      console.log('Node.js est à l\'écoute sur le port %s ', PORT);
    });
  })
  .catch(err => console.log(err));

