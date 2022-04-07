require('dotenv').config()
const express = require('express');
const configViewEngine = require('./config/viewEngine')
const initWebRoutes = require('./routes/web')
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const configSession = require('./config/session');
const { sequelize } = require('./models');
const app = express()

// Configuring server for cookies
app.use(cookieParser('secret'))

// Showing the meessage to the user
app.use(flash())

// Configuring body-parser for post
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Configuring the view engine
configViewEngine.configViewEngine(app);

// Config app session
configSession(app)

//Configure passport
app.use(passport.initialize())
app.use(passport.session())

// Initializing all the web routes
initWebRoutes.initAllWebRoute(app);

// Handle 404
app.use(function(req, res) {
    res.status(404).send('Bruh... 404...');
});

const port = process.env.PORT || 3030;

app.listen(port, async() => {
    await sequelize.authenticate()
    console.log(`The application is running on port number ${port}`);
})