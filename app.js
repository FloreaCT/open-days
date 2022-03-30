// const express = require('express')
// const PORT = process.env.PORT || 3030;
// let my_import = require('./routes/index')

// const { auth } = require('express-openid-connect');
// require('dotenv').config()

// // Express app
// const app = express()

// // Registering the view
// app.use(express.static('/public'))
// app.set('view engine', 'ejs')
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(express.static('public'))

// app.use('/', my_import.router)

// // Listen for requests
// app.listen(PORT, () => {
//     console.log(`I am live on port: ${PORT}`)
// })

// my_import.connection.query('SELECT * FROM user', (err, res) => {
//     if (err) {
//         return console.log(err);
//     }
//     return console.log(res[1]['surname']);
// })
require('dotenv')
var express = require('express');
var app = express()
var configViewEngine = require('./config/viewEngine')
var initWebRoutes = require('./routes/web')
var connectDB = require('./config/connectDB')
    // Configuring the view engine
configViewEngine.configViewEngine(app);

// Connecting to the database
console.log(typeof connectDB);
// Initializing all the web routes
initWebRoutes.initAllWebRoute(app);

const port = process.env.PORT || 3030;
app.use('/', function(req, res, next) {
        console.log(req.url);
        next();
    })
    // Handle 404
app.use(function(req, res) {
    res.status(404).send('Bruh... 404...');
});

app.listen(port, () => {
    console.log(`The application is running on port number ${port}`);
})