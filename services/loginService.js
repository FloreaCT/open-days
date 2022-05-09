const db = require('../models')
const bcrypt = require('bcryptjs')


let handleLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        //check email is exist or not
        let user = await findUserByEmail(email);
        if (user) {
            //compare password
            await bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    resolve(true);
                } else {
                    reject(`The password that you've entered is incorrect`);
                }
            });
        } else {
            reject(`This user email "${email}" doesn't exist`);
        }
    });
};

let findUserByEmail = (emailInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: emailInput
                }
            })
            if (!user)
                reject(`We can't find a user with ${emailInput} email addresss. <a href="/register">Register account</a>`)

            resolve(user)
        } catch (e) {
            reject(e)
        }
    })
}

let comparePassword = (password, userObject) => {
    return new Promise(async(resolve, reject) => {
        try {
            let isMatch = await bcrypt.compare(password, userObject.password)
            if (isMatch) {
                resolve(true)
            } else {
                resolve("The password that you have entered is incorrect!")
            }
        } catch (e) {
            reject(e)
        }
    })
}

let findUserById = (idInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: idInput
                }
            })
            if (!user) reject(` User not found by the id: ${idInput}`)
            resolve(user)
        } catch (err) {
            reject(err)
        }
    })
}


module.exports = {
    findUserByEmail: findUserByEmail,
    comparePassword: comparePassword,
    findUserById: findUserById,
    handleLogin: handleLogin
}