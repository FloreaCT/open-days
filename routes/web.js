var express = require('express');

var homepageController = require("../controllers/homepageController")

let router = express.Router();

module.exports = {
    initAllWebRoute(app) {
        router.get("/", homepageController.getHomepage)

        return app.use("/", router)
    }
}