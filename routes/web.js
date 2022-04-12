const express = require('express');
const homepageController = require("../controllers/homepageController")
const auth = require("../validation/authValidation")
const initPassportLocal = require('../controllers/passport/passportLocal')
const passport = require('passport')
const authController = require('../controllers/authController')
const models = require('../models')
const dataController = require('../controllers/dataController')

// Initialize passport
initPassportLocal()

// Initialize all web routes
const router = express.Router();

module.exports = {
    initAllWebRoute(app) {
        router.get("/", homepageController.getHomepage,
            app.get("/", function(req, res) {
                var isAuth = req.isAuthenticated()
                res.render('index', { isAuth: isAuth })
            }))

        router.get('/post_event', dataController.post_event)
        router.get("/register", authController.checkLoggedOut, homepageController.getRegisterPage)
        router.get("/login", authController.checkLoggedOut, homepageController.getLoginPage)
        router.get("/profile", authController.checkLoggedIn, homepageController.getProfilePage)
        router.get("/book", authController.checkLoggedIn, dataController.events)
        router.get("/forgot-password", authController.checkLoggedOut, homepageController.getForgotPassword)
        router.get("/myBookings", authController.checkLoggedIn, dataController.getMyBookings)
        router.get("/addEvent", authController.checkLoggedIn, dataController.getAddEvent)
        router.get("/logout", function(req, res) {
            req.logout();
            req.session.destroy();
            res.redirect("/")
        })

        router.post('/book', dataController.submbitInterest)
        router.post("/addEvent", authController.checkLoggedIn, dataController.addEvent)
        router.post("/register", auth.validateRegister, homepageController.handleRegister)
        router.post("/login", passport.authenticate("local", {
            successRedirect: "/profile",
            failureRedirect: "/login",
            successFlash: true,
            failureFlash: true
        }))
        router.post('/addEvent', dataController.addEvent)
        router.post("/forgot-password", homepageController.forgotPassword)
        router.get("/logout", authController.postLogOut)

        return app.use("/", router)
    }
}