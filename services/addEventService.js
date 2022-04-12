const db = require("../models")

let addAEvent = (event, req, res) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Checking if user or email already exists in the db
            // Return true if email exists in db

            let doesEventExists = await eventExists(event, req, res)
            if (doesEventExists) {
                reject(`You can have only 1 event.`)

            } else {
                // Create event

                await db.Event.create(event);
                resolve("Done!")
            }
        } catch (err) {
            reject(err)
        }

    })
}


let eventExists = (eventCheck, req, res) => {
    return new Promise(async(resolve, reject) => {
        try {
            let currentEvent = await db.Event.findOne({
                where: {
                    userId: req.user.id
                }
            })

            if (currentEvent) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (err) {
            // Displaying the error message to the user
            req.flash('errors')
            return res.redirect('/addEvent')
        }
    })
}

module.exports = { addAEvent: addAEvent }