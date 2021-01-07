const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {

    sequelize.define('order_detail', {
        price: { 
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: { 
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
}; 