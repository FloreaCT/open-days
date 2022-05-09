const { validationResult } = require("express-validator")
const { createUser } = require("../services/userService")
const { findUserByEmail } = require("../services/loginService")


let getHomepage = (req, res) => {
    if (!req.user) {
        var user = false
        var isAuth = req.isAuthenticated()
        res.render('index', { user: user, isAuth: isAuth })
    } else {
        var user = req.user
        var isAuth = req.isAuthenticated()
        return res.render('index', { user: user, isAuth: isAuth })
    }
}

let getProfilePage = (req, res) => {
    let user = req.user
    return res.render("profile.ejs", { user: user })
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
        phone: req.body.phone,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        roleId: req.body.roleId
    }

    return res.render("auth/register.ejs", {
        errors: req.flash('errors'),
        form: form
    })
}

let getLoginPage = async(req, res) => {
    return res.render("auth/login.ejs", {
        errors: req.flash('errors')
    })
}

let getAdminPage = async(req, res) => {
    return res.render("adminPage.ejs", {
        errors: req.flash('errors'),
    })
}

let getForgotPassword = async(req, res) => {
    return res.render("auth/forgotPassword.ejs", {
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
            return res.redirect("/forgotPassword")
        }
    } catch (err) {
        req.flash('errors', err)
        return res.render("auth/forgotPassword.ejs", {
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
        phone: req.body.phone,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        roleId: req.body.roleId
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
        var roleId = req.body.roleId
        if (!roleId) {
            roleId = 1
        }
        let user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            email: req.body.email,
            university: req.body.university,
            phone: req.body.phone,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            roleId: roleId,
            createdAt: Date.now()
        };

        await createUser(user, req, res) // Waiting for function return before proceeding 

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