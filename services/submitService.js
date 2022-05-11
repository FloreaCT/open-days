const db = require("../models")

let submit = (submit, req, res) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Checking if user has registered for that event
            // Return true if he did
            let isAlreadyInterested = await checkInterest(submit, req, res)
            if (isAlreadyInterested) {
                reject("You have already registered for that event")
            } else {
                // Create attend
                await db.Attenders_to.create(submit);
                resolve("Done!")

            }
        } catch (err) {
            reject(err)
        }

    })
}

let checkInterest = (submit, req, res) => {
    return new Promise(async(resolve, reject) => {
            try {
                let currentInterest = await db.Attenders_to.findOne({
                    where: {
                        userId: submit.userId,
                        eventId: submit.eventId
                    }
                })

                if (currentInterest) {

                    resolve(true)
                } else {

                    resolve(false)
                }
            } catch (err) {
                return res.redirect('/register')
            }
        }

    )
}

module.exports = { submit: submit }