const server = require('express').Router();
const { User, Order } = require('../db');

//Ruta para crear usuario
server.post('/', (req, res, next) => {
    User.create({
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password
    })
    .then( user => {
        Order.create({
            status: "created",
            price: 0,
            quantity: 0,
            userId: user.dataValues.id    
        })
    })
    .then( order => {
        res.status(201).send("Usuario creado con éxito")
    })
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })
})



module.exports = server;