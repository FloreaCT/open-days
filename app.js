require('dotenv')
var express = require('express');
var app = express()
var configViewEngine = require('./config/viewEngine')
var initWebRoutes = require('./routes/web')
var bodyParser = require('body-parser')

// Configuring body-parser for post
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Configuring the view engine
configViewEngine.configViewEngine(app);

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