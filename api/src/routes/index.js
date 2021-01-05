const { Router } = require('express');
const order = require('./order');
const product = require('./product');
const user = require('./user');

const routes = Router();

routes.use('/order', order);
routes.use('/product', product);
routes.use('/user', user);

module.exports = routes;