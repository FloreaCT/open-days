const { validationResult } = require("express-validator")
const { append } = require("express/lib/response")
const userService = require("../services/userService")
require('express-validator')
var getHomepage = (req, res) => {
    return res.render('index')
}

var getNewUserPage = (req, res) => {
    return res.render("createUser.ejs")
}

var createNewUser = async(req, res) => {
    let user = req.body;
    await userService.createNewUser(user);
    return res.redirect("/")
}

let getRegisterPage = async(req, res) => {
    let form = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }

    return res.render("auth/register.ejs", {
        errors: req.flash('errors'),
        form: form
    })
}

let getLoginPage = async(req, res) => {
    return res.render("auth/login.ejs", {
        errors: req.flash('errors'),
    })
}

let handleRegister = async(req, res) => {
    // Keep old input
    let form = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }

    // Check user inputs
    // Create empty array to save error 
    let errorsArr = []
    let validationError = validationResult(req)
    if (!validationError.isEmpty()) {
        var errors = Object.values(validationError.mapped())
        errors.forEach((item) => {
            errorsArr.push(item.msg)
        })
        req.flash("errors", errorsArr)
        return res.render("auth/register.ejs", {
            errors: req.flash('errors'),
            form: form
        })
    }

    // Create user
    try {
        let user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            createdAt: Date.now()
        };
        await userService.createNewUser(user)
        return res.redirect("/")

    } catch (err) {
        req.flash('errors', err)
        return res.render("auth/register.ejs", {
            errors: req.flash('errors'),
            form: form
        })
    }

}

module.exports = {
    getHomepage: getHomepage,
    getNewUserPage: getNewUserPage,
    createNewUser: createNewUser,
    getRegisterPage: getRegisterPage,
    getLoginPage: getLoginPage,
    handleRegister: handleRegister,
}