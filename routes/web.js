var express = require('express');
var { home } = require('nodemon/lib/utils');
var auth = require("../validation/authValidation")
var initPassportLocal = require('../controllers/passport/passportLocal')
var homepageController = require("../controllers/homepageController")
var passport = require('passport')

// Initialize all web routes
var router = express.Router();

// Initialize passport
initPassportLocal()

module.exports = {
    initAllWebRoute(app) {
        router.get("/", homepageController.getHomepage)
        router.get("/register", homepageController.getRegisterPage)
        router.get("/login", homepageController.getLoginPage)


        router.post("/register", auth.validateRegister, homepageController.handleRegister)
        router.post("/login", passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            successFlash: true,
            failureFlash: true
        }))

        router.post("/create-new-user", homepageController.createNewUser)
        router.get("/new-user", homepageController.getNewUserPage)
        return app.use("/", router)
    }
}