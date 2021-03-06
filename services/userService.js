const db = require("../models")
const bcrypt = require("bcryptjs")

let createUser = (user, req, res) => {
    return new Promise(async(resolve, reject) => {
        try {

            // Checking if user or email already exists in the db
            // Return true if email exists in db
            let isEmailExist = await checkEmailUser(user, req, res)
            if (isEmailExist) {
                reject(`${user.email} is already in our database. <a href="/forgotPassword">Recover lost password</a>`)
            } else if ([1, 'institute', 'administrator'].includes(user.roleId)) { // Checking if user has inserted a code for institute or administrator on registration form.

                // Hash the password
                const salt = bcrypt.genSaltSync(10)
                user.password = await bcrypt.hashSync(user.password.toString(), salt)

                // If the user has entered the code, we adjust its roleId to reflect the code.
                if (user.roleId === 'institute') {
                    user.roleId = "2"
                } else if (user.roleId === 'administrator') {
                    user.roleId = "3"
                }

                if (!user.university) {
                    user.university = "Not at University"
                }
                // Create user
                await db.User.create(user);
                resolve("Done!")
            } else {

                reject('Invalid code! Please enter the correct code!')
            }

        } catch (err) {
            reject(err)
        }

    })
}

let checkEmailUser = (userCheck, req, res) => {
    return new Promise(async(resolve, reject) => {
        try {
            let currentUser = await db.User.findOne({
                where: {
                    email: userCheck.email
                }
            })

            if (currentUser) {

                resolve(true)
            } else {
                resolve(false)
            }
        } catch (err) {
            // Displaying the error message to the user

            req.flash('errors')
            return res.redirect('/register')
        }
    })
}

module.exports = { createUser: createUser, checkEmailUser: checkEmailUser }