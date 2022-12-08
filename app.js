"use strict";

const express = require('express');
const mongoose = require('mongoose');
var hateoasLinker = require('express-hateoas-links');
const app = express();

app.use(express.json());

app.use(hateoasLinker);

app.get('/favicon.ico', (req, res) => res.status(204));

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

app.use(errorController.get404);

app.use(function (err, req, res, next) {
  console.log('err', err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});


mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => console.log(err));

