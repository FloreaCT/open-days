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
        router.get('/post_event', dataController.post_event)
        router.get("/register", authController.checkLoggedOut, homepageController.getRegisterPage)
        router.get("/login", authController.checkLoggedOut, homepageController.getLoginPage)
        router.get("/profile", authController.checkLoggedIn, homepageController.getProfilePage)
        router.get("/book", authController.checkLoggedIn, dataController.events)
        router.get("/forgotPassword", authController.checkLoggedOut, homepageController.getForgotPassword)
        router.get("/myBookings", authController.checkLoggedIn, dataController.getMyBookings)
        router.get("/myEvents", authController.checkLoggedIn, (authController.checkInstitute, dataController.getMyEvents))
        router.get("/addEvent", authController.checkLoggedIn, (authController.checkInstitute, dataController.getAddEvent))
        router.get("/adminPage", authController.checkLoggedIn, (homepageController.getAdminPage, authController.checkRole))
        router.get("/logout", function(req, res) {
            req.logout();
            req.session.destroy();
            res.redirect("/")
        })

        router.post('/book', dataController.submbitInterest)
        router.post("/addEvent", (upload.upload, dataController.addEvent))
        router.post("/deleteEvent", (upload.upload, dataController.deleteEvent))
        router.post("/removeBooking", (upload.upload, dataController.removeBooking))
        router.post("/register", auth.validateRegister, homepageController.handleRegister)
        router.post("/login", passport.authenticate('local', {
            failureRedirect: '/login'
        }), (req, res) => {
            if (req.user.roleId === 3) {
                res.render('adminPage');
            }
            if (req.user.roleId != 3) {
                res.redirect('/profile');
            }

        })

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
        router.post("/addEvent", dataController.addEvent)
        router.post("/forgotPassword", homepageController.forgotPassword)

        // router.get("/logout", authController.postLogOut)

        return app.use("/", router)
    }
}