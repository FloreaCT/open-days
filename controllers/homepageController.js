const { validationResult } = require("express-validator")
const { createUser } = require("../services/userService")
const { findUserByEmail } = require("../services/loginService")


let getHomepage = (req, res) => {
    return res.render('index')
}

let getProfilePage = (req, res) => {
    return res.render("profile.ejs")
}

let getEventsPage = (req, res) => {
    return res.render("book.ejs")
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
        city: req.body.city,
        email: req.body.email,
        university: req.body.university,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        hasRole: req.body.hasRole
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
    return res.render("auth/admin.ejs", {
        errors: req.flash('errors'),
    })
}

let getForgotPassword = async(req, res) => {
    return res.render("auth/forgot-password.ejs", {
        errors: req.flash('errors'),
    })
}

let forgotPassword = async(req, res) => {
    let form = {
        email: req.body.email,
        error: `Password reset email has been sent to ${req.body.email}`
    }

    try {
        let isEmail = await findUserByEmail(req.body.email)
        if (isEmail) {
            return res.write(
                `<script>window.alert("Reset password email has been sent to ${req.body.email}");window.location="/";</script>`
            );
        } else {
            return res.redirect("/forgot-password")
        }
    } catch (err) {
        req.flash('errors', err)
        return res.render("auth/forgot-password.ejs", {
            errors: req.flash('errors'),
            form: form
        })
    }
}


let handleRegister = async(req, res) => {
    // Keep old input
    let form = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        email: req.body.email,
        university: req.body.university,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        hasRole: req.body.hasRole
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
        var hasRole = req.body.hasRole
        if (!hasRole) {
            hasRole = 1
        }
        let user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            email: req.body.email,
            university: req.body.university,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            hasRole: hasRole,
            createdAt: Date.now()
        };

        await createUser(user, req, res)

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
    getAdminPage: getAdminPage,
    forgotPassword: forgotPassword,
    getForgotPassword: getForgotPassword,
    getEventsPage: getEventsPage
}