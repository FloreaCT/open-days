const { validationResult } = require("express-validator")
const loginService = require("../services/loginService")

let getPageLogin = (req, res) => {
    return res.render("login.ejs", {
        errors: req.flash("errors")
    });
};

let handleLogin = async(req, res) => {
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/login");
    }

    try {
        await loginService.handleLogin(req.body.email, req.body.password);
        return res.redirect("/");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/login");
    }
};

let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next()
}

let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

let postLogOut = (req, res) => {
    req.session.destroy(function(error) {
        return res.redirect('/')
    })
}

let checkRole = (req, res, next) => {
    if (req.user.roleId == 3) {
        return 3
    } else {
        // TODO: RENDER
        next()
            // res.redirect("/")
    }
}

let checkInstitute = (req, res, next) => {
    if (!req.user.roleId == 2) {
        return res.redirect('/profile')
    }
    next()
}

let checkUser = (req, res, next) => {
    if (!req.user.roleId == 1) {
        return res.redirect('/profile')
    }
    next()
}
module.exports = {
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut,
    handleLogin: handleLogin,
    getPageLogin: getPageLogin,
    checkRole: checkRole,
    checkInstitute: checkInstitute,
    checkUser: checkUser
}