const server = require('express').Router();
const { User } = require('../db');

server.post('/', (req, res, next) => {

    if(!req.body.email || !req.body.name || !req.body.surname || !req.body.password){ 
        res.status(400)
        .send('Cuidado! Faltan datos para poder crear un usuario')
    } else {
        User.create({
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            password: req.body.password
        })
        .then(function (user) {
            res.status(201)
            res.send(user)
        })
        .catch(next);        
    }
});

module.exports = server;