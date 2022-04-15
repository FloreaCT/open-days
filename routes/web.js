const express = require('express');
const homepageController = require("../controllers/homepageController")
const dataController = require('../controllers/dataController')
const authController = require('../controllers/authController')
    // const upload = require('../controllers/imageController')
const auth = require("../validation/authValidation")
const initPassportLocal = require('../controllers/passport/passportLocal')
const passport = require('passport')
const models = require('../models')
const multer = require('multer')
const path = require('path')
const db = require('../config/session')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/uploadedImages') // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});





// Initialize passport
initPassportLocal()

// Initialize all web routes
const router = express.Router();

module.exports = {
    initAllWebRoute(app) {
        router.get("/", homepageController.getHomepage, authController.checkRole)
        router.get("/register", authController.checkLoggedOut, homepageController.getRegisterPage)
        router.get("/login", authController.checkLoggedOut, homepageController.getLoginPage)
        router.get("/profile", authController.checkLoggedIn, homepageController.getProfilePage)
        router.get("/book", authController.checkLoggedIn, authController.checkUser, dataController.events)
        router.get("/forgotPassword", authController.checkLoggedOut, homepageController.getForgotPassword)
        router.get("/myBookings", authController.checkLoggedIn, dataController.getMyBookings)
        router.get("/myEvents", authController.checkLoggedIn, dataController.getMyEvents)
        router.get("/addEvent", authController.checkLoggedIn, dataController.getAddEvent)
        router.get("/manageEvents", authController.checkLoggedIn, dataController.getAllEvents)
        router.get("/manageUsers", authController.checkLoggedIn, dataController.getAllUsers)
        router.get("/manageAttenders", authController.checkLoggedIn, dataController.getAllAttenders)
        router.get("/logout", function(req, res) {
            req.logout();
            req.session.destroy();
            res.redirect("/")
        })

        router.post("/book", dataController.submbitInterest)
        router.post("/addEvent", (upload.upload, dataController.addEvent))
        router.post("/deleteEvent", dataController.deleteEvent)
        router.post("/removeBooking", dataController.removeBooking)
        router.post("/register", auth.validateRegister, homepageController.handleRegister)
        router.post("/addEvent", dataController.addEvent)
        router.post("/forgotPassword", homepageController.forgotPassword)
        router.post("/findUser", dataController.findUser)
        router.post("/users/edit/", dataController.editUser);
        router.post("/users/delete/", dataController.deleteUser)
        router.post("/findAttender", dataController.findAttender)
        router.post("/attender/delete", dataController.deleteAttender)
        router.post("/login", passport.authenticate('local', {
            successRedirect: "/",
            failureRedirect: "/login",
            successFlash: true,
            failureFlash: true
        }))

        router.post("/upload", upload.single('image'), (req, res) => {
            if (!req.file) {
                console.log("No file upload");
            } else {
                var imgName = 'http://127.0.0.1:3030/images/uploadedImages/' + req.file.filename
                var insertData = `UPDATE events SET image = "${imgName}" WHERE userId = ${req.user.id}`

                db.myDatabase.query(insertData, (err, result) => {
                    if (err) throw err
                })

                res.redirect('/myEvents')
            }
        })



        // router.get("/logout", authController.postLogOut)
        return app.use("/", router)
    }
}