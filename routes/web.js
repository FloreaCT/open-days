const express = require('express');
const homepageController = require("../controllers/homepageController")
const auth = require("../validation/authValidation")
const initPassportLocal = require('../controllers/passport/passportLocal')
const passport = require('passport')
const authController = require('../controllers/authController')

// Initialize all web routes
const router = express.Router();

// Initialize passport
initPassportLocal()

module.exports = {
    initAllWebRoute(app) {
        router.get("/", homepageController.getHomepage,
            app.get("/", function(req, res) {
                var isAuth = req.isAuthenticated()
                res.render('index', { isAuth: isAuth })
            }))
        router.get("/register", authController.checkLoggedIn, homepageController.getRegisterPage)
        router.get("/login", authController.checkLoggedIn, homepageController.getLoginPage)
        router.get("/profile", authController.checkLoggedOut, homepageController.getProfilePage)
        router.get("/book", authController.checkLoggedOut, homepageController.getEventsPage)
        router.get("/forgot-password", authController.checkLoggedIn, homepageController.getForgotPassword)
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
        router.post("/forgot-password", homepageController.forgotPassword)
        router.post("/create-new-user", homepageController.createNewUser)
        router.get("/logout", authController.postLogOut)

        return app.use("/", router)
    }
}