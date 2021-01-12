const server = require('express').Router();
const { Order , Order_detail, Product, User} = require('../db');
const { Op } = require("sequelize");
const mercadopago = require("mercadopago");

server.post('/', (req, res, next) => {
    const { userId, orderlines, status } = req.body

    Order.create({
        userId: userId,
        status: status
    })
    .then(response => {
        Promise.all(
        orderlines.map(elem => {
            Product.findByPk( elem.id)
              .then(producto =>{
                const orderId = response.dataValues.id //nos da el id de order
                
                return Order_detail.create({
                    orderId: orderId,
                    productId: producto.id,
                    quantity: elem.quantity,
                    price: producto.price
                })
              })
                .then(secondResponse => { //nos da el arreglo creado
                    const cant = secondResponse.dataValues.quantity
                    const prodId = secondResponse.dataValues.productId
                    Product.decrement(
                        {stock: cant},
                        { where: { id: prodId } }
                    )
                })
            })
        )
        .then( _ => res.send("OK"))
        .catch(err => next(err))
    })
});


server.get('/detalle/:id', (req, res, next) => {
    const id = req.params.id

    Order.findOne({
        where: {
          id: id,
        },
            include: {
                model: Order_detail,
                     where: { orderId: id},
                       }}).then(obj => {
                    res.send(obj)
                }).catch(next)
              });


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