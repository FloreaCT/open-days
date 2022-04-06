const express = require('express');
const homepageController = require("../controllers/homepageController")
const auth = require("../validation/authValidation")
const initPassportLocal = require('../controllers/passport/passportLocal')
const passport = require('passport')

// Initialize all web routes
const router = express.Router();


console.log();
// Initialize passport
initPassportLocal()

let checkLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.isAuthenticated())
        return res.redirect("/")
    }
    next()
}

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated() === false) {
        console.log(req.isAuthenticated());
        return res.redirect("/")
    }
    next()
}


let postLogOut = (req, res) => {
    req.logout();
    res.redirect('/');
}

module.exports = {
    initAllWebRoute(app) {
        router.get("/", homepageController.getHomepage,
            app.get("/", function(req, res) {
                var usera = req.isAuthenticated()
                console.log(app.locals.usera);
                res.render('index', { usera })

            }))
        router.get("/register", checkLoggedIn, homepageController.getRegisterPage)
        router.get("/login", checkLoggedIn, homepageController.getLoginPage)
        router.get("/profile", checkLoggedOut, homepageController.getProfilePage)
        router.get("/logout", function(req, res) {
            req.logout();
            req.session.destroy();
            res.redirect("/")
        })
        router.post("/register", auth.validateRegister, homepageController.handleRegister)
        router.post("/login", passport.authenticate("local", {
            successRedirect: "/profile",
            failureRedirect: "/login",
            successFlash: true,
            failureFlash: true
        }))
        router.post("/create-new-user", homepageController.createNewUser)
        router.get("/logout", postLogOut)

        return app.use("/", router)
    }
}