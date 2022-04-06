//  const { response } = require("express");
const db = require("../models")
const bcrypt = require("bcryptjs")


let createNewUser = (user, req, res) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Checking if user or email already exists in the db
            // Return true if email exists in db
            let isEmailExist = await checkEmailUser(user, req, res)
            if (isEmailExist) {
                reject(`${user.email} is already in our database. <a href="/forgot-password">Recover lost password</a>`)
            } else {
                // Hash the password
                const salt = bcrypt.genSaltSync(10)
                user.password = await bcrypt.hashSync(user.password.toString(), salt)

                // Update the password

                // Create user
                await db.User.create(user);
                resolve("Done!")
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

module.exports = createNewUser