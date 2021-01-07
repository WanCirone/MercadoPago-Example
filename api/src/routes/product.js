const server = require('express').Router();
const { Product } = require('../db');

//Ruta para crear nuevo producto
server.post('/', (req, res, next) => {
    if(!req.body.name || !req.body.description || !req.body.price || !req.body.stock || !req.body.img) { 
        res.status(400).send('Cuidado! no se permiten campos indefinidos')
    } else { 
        Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            img: req.body.img
        })
        .then((prod) => {
            res.status(201).send("Producto creado con éxito")
        })
        .catch(next);
    }
});

//Ruta que me trae todos los productos existentes
server.get('/products', (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.status(200).send(products);
    })
    .catch(next);
});

module.exports = server;