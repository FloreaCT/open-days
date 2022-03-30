var express = require('express');
const { home } = require('nodemon/lib/utils');

var homepageController = require("../controllers/homepageController")

let router = express.Router();

module.exports = {
    initAllWebRoute(app) {
        router.get("/", homepageController.getHomepage)
        router.get("/new-user", homepageController.getNewUserPage)
        router.post("/create-new-user", homepageController.createNewUser)
        return app.use("/", router)
    }
}