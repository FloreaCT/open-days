require('dotenv').config()

const { Sequelize } = require('sequelize')

const DB_NAME = process.env.DB_NAME
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
});


let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully');
    } catch (error) {
        console.error("Unable to connect to the database: ", error)
    }
}

module.exports = connectDB();