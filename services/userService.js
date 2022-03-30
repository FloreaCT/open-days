 let db = require("../models")
 let createNewUser = (user) => {
     return new Promise(async(resolve, reject) => {
         try {
             await db.User.create(user);
             resolve("Done!")
         } catch (e) {
             reject(e)
         }

     })
 }

 module.exports = { createNewUser: createNewUser }