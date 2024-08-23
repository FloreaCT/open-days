const express = require("express");
const homepageController = require("../controllers/homepageController");
const dataController = require("../controllers/dataController");
const authController = require("../controllers/authController");
const imageController = require("../controllers/imageController");
const auth = require("../validation/authValidation");
const initPassportLocal = require("../controllers/passport/passportLocal");
const passport = require("passport");

// Initialize passport
initPassportLocal();

// Initialize all web routes
const router = express.Router();

module.exports = {
  initAllWebRoute(app) {
    router.get("/", homepageController.getHomepage, authController.checkRole);
    router.get(
      "/register",
      authController.checkLoggedOut,
      homepageController.getRegisterPage
    );
    router.get(
      "/login",
      authController.checkLoggedOut,
      homepageController.getLoginPage
    );
    router.get(
      "/profile",
      authController.checkLoggedIn,
      homepageController.getProfilePage
    );
    router.get(
      "/book",
      authController.checkLoggedIn,
      authController.checkUser,
      dataController.events
    );
    router.get(
      "/forgotPassword",
      authController.checkLoggedOut,
      homepageController.getForgotPassword
    );
    router.get(
      "/myBookings",
      authController.checkLoggedIn,
      dataController.getMyBookings
    );
    router.get(
      "/myEvents",
      authController.checkLoggedIn,
      dataController.getMyEvents
    );
    router.get(
      "/addEvent",
      authController.checkLoggedIn,
      dataController.getAddEvent
    );
    router.get(
      "/manageEvents",
      authController.checkLoggedIn,
      dataController.getAllEvents
    );
    router.get(
      "/manageUsers",
      authController.checkLoggedIn,
      dataController.getAllUsers
    );
    router.get(
      "/manageAttenders",
      authController.checkLoggedIn,
      dataController.getAllAttenders
    );
    router.get("/logout", authController.postLogOut);
    router.get("/updatePassword", function (req, res, next) {
      res.render("auth/updatePassword", {
        title: "Update Password Page",
        token: req.query.token,
        msg: "",
      });
    });
    router.get("/resetPassword", function (req, res, next) {
      res.render("auth/resetPassword", {
        title: "Reset Password Page",
        token: req.query.token,
        msg: "",
      });
    });

    // Corrected Post Route for Adding an Event
    router.post(
      "/addEvent",
      imageController.upload.single("image"),
      dataController.addEvent
    );

    // Other routes
    router.post("/deleteEvent", dataController.deleteEvent);
    router.post("/removeBooking", dataController.removeBooking);
    router.post(
      "/register",
      auth.validateRegister,
      homepageController.handleRegister
    );
    router.post("/forgotPassword", homepageController.forgotPassword);
    router.post("/findUser", dataController.findUser);
    router.post("/users/edit/", dataController.editUser);
    router.post("/users/delete/", dataController.deleteUser);
    router.post("/deleteMyAccount", dataController.deleteMyAccount);
    router.post("/findAttender", dataController.findAttender);
    router.post("/attender/delete", dataController.deleteAttender);
    router.post(
      "/upload",
      imageController.upload.single("image"),
      imageController.image
    );
    router.post("/resetPassword", authController.passwordRecovery);
    router.post("/updatePassword", authController.passwordUpdate);

    // Login route
    router.post(
      "/login",
      passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true,
      })
    );

    return app.use("/", router);
  },
};
