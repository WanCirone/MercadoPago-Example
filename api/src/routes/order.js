const server = require('express').Router();
const { Order, Order_detail } = require('../db');
const { Op } = require("sequelize");
const mercadopago = require("mercadopago");

// // Agrega credenciales
// mercadopago.configure({
//     sandbox: true,
//     access_token: process.env.MELI_ACCESS_TOKEN,
// });


//Ruta para agregar producto al carrito
server.post('/:idUser/cart', (req, res, next) => {
    Order.findOne({
        where: {
            [Op.and]: [
                { userId: req.params.idUser }, 
                { status: 'created' } 
            ]
        }
    })
    .then( order => {
        const order_id  = order.dataValues.id;

        order.update({
            price: order.dataValues.price + (req.body.product_quantity * req.body.product_price),
            quantity: order.dataValues.quantity + req.body.product_quantity
        })
        
        Order_detail.findOne({
            where: {
                [Op.and]: [
                    { productId: req.body.productId}, 
                    { orderId: order.dataValues.id }
                ]
            }
        })
        .then( od => {
            if(od) {
                od.update({
                    quantity: od.dataValues.quantity + req.body.product_quantity
                })
                return;
            }
            else {
                Order_detail.create({
                    price: req.body.product_price,
                    quantity: req.body.product_quantity,
                    productId: req.body.productId,  
                    orderId: order_id   
                })
                return;
            }
        })
        .then( detalle => {
            res.status(200).send("Producto agregado al carrito con éxito");
        })
        .catch(error => {
            res.sendStatus(400)
        })
    })
    
})

//Ruta que me trae todas las ordenes existentes con detalle
server.get('/', (req, res, next) => { 
    Order.findAll({
        include: Order_detail 
    })
    .then(order => {
        res.send(order);
    })
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })
});

module.exports = server;