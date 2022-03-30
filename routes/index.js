const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'eu-cdbr-west-02.cleardb.net',
    user: 'be080b26f8c432',
    password: '905caa8e',
    database: 'heroku_c9b11e36dc12589'
})

router.get('/', (req, res) => {
    res.render('index', { title: "Express" })
})

module.exports = { router, connection };