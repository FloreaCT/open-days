const { validationResult } = require("express-validator")
const userService = require("../services/userService")


let getHomepage = (req, res) => {

    return res.render('index')
}

let getProfilePage = (req, res) => {
    return res.render("profile.ejs")
}

let createNewUser = async(req, res) => {
    let user = req.body;
    await userService(user);
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

let getAdminPage = async(req, res) => {
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

        await userService(user, req, res)

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
    getProfilePage: getProfilePage,
    createNewUser: createNewUser,
    getRegisterPage: getRegisterPage,
    getLoginPage: getLoginPage,
    handleRegister: handleRegister,
    getAdminPage: getAdminPage
}