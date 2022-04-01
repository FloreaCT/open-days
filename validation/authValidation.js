let check = require('express-validator')

let validateRegister = [
    check.check("email", "Invalid email!").isEmail().trim(),

    check.check("password", "Invalid password. Password must be at least 4 chars long")
    .isLength({ min: 4 }),

    check.check("confirmPassword", "Password confirmation does not match password")
    .custom((value, { req }) => {
        return value === req.body.password

    })


]

module.exports = {
    validateRegister: validateRegister
}