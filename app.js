require('dotenv')
var express = require('express');
var configViewEngine = require('./config/viewEngine')
var initWebRoutes = require('./routes/web')
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var app = express()


// Configuring server for cookies
app.use(cookieParser('secret'))

// Configuring server to use express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

// Showing the meessage to the user
app.use(flash())

// Configuring body-parser for post
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Configuring the view engine
configViewEngine.configViewEngine(app);

//Configure passport
app.use(passport.initialize())
app.use(passport.session())
passport.initialize()

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