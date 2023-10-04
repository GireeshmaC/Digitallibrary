const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('myappdb', 'root', 'Password@123', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: '3306'
});

module.exports = sequelize;