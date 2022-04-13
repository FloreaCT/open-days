const models = require('../models')
const { submit } = require('../services/submitService')
const { addAEvent } = require('../services/addEventService')
const { validationResult } = require("express-validator")
const db = require('../models')



const post_event = function(req, res) {
    models.Event.findAll()
        .then(events => {
            var isAuth = req.isAuthenticated()
            res.render('post_event', { isAuth: isAuth, data: events });
        })
        .catch(err => console.log(err))
}

const events = function(req, res) {
    var user = req.user
    models.Event.findAll().then(events => {
        res.render('book', { user: user, data: events })
    })
}

const oneEvent = function(req, res) {
    var isAuth = req.isAuthenticated()
    models.Event.findOne({
        where: { userId: req.user.id }
    }).then(event => {
        res.render('book', { event: event })
    })
}

const getMyBookings = async function(req, res) {
    var isAuth = req.isAuthenticated()
    query = await db.sequelize.query(`SELECT * FROM events  INNER JOIN attenders_to on attenders_to.eventId = events.id INNER JOIN users on attenders_to.userId = users.id where users.id = ${req.user.id};`)
    return res.render('myBookings', { isAuth: isAuth, mybookings: query })
}

let submbitInterest = async(req, res) => {

    // Register user to database
    try {

        let user = {
            userId: req.user.id,
            eventId: req.body.eventId,
            createdAt: Date.now()
        };
        await submit(user, req, res)

        return res.write(`<script>window.alert("Registration successful! See you soon!");window.location="/book";</script>`)

    } catch (err) {
        return res.write(`<script>window.alert("You have already registered to that event!");window.location="/book";</script>`)
    }
}

let deleteEvent = function(req, res) {

    models.Event.findOne({
        where: { userId: req.user.id }
    }).then(event => {
        event.destroy()
        res.write(`<script>window.alert("Event has been successfully deleted!");window.location="/myEvents";</script>`)
    })
}

let removeBooking = function(req, res) {
    models.Attenders_to.findOne({
        where: { eventId: req.body.remove, userId: req.user.id }
    }).then(booking => {
        booking.destroy()
        res.write(`<script>window.alert("Booking has been successfully removed!");window.location="/myBookings";</script>`)
    })
}

let getMyEvents = function(req, res) {
    let isAuth = req.isAuthenticated()
    models.Event.findOne({
        where: { userId: req.user.id }
    }).then(event => {
        if (event === null) {
            event = false
            res.render('../views/auth/myEvents.ejs', { event: event, isAuth: isAuth })
        }
        res.render('../views/auth/myEvents.ejs', { event: event, isAuth: isAuth })

    }).catch(function(err) {
        console.log(err);
    });

}

let getAddEvent = async function(req, res) {
    let form = {
        title: req.body.title,
        description: req.body.description,
        begin_at: req.body.begin_at,
        ends_at: req.body.ends_at,
        userId: req.user.id

    }
    var isAuth = req.isAuthenticated()
    return res.render('addEvent.ejs', {
        isAuth: isAuth,
        errors: req.flash('errors'),
        form: form
    })
}



let addEvent = async(req, res) => {
    // Keep old input
    let form = {
        title: req.body.title,
        description: req.body.description,
        begin_at: req.body.begin_at,
        ends_at: req.body.ends_at,
        userId: req.user.id

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
        return res.render("addEvent.ejs", {
            errors: req.flash('errors'),
            form: form
        })
    }

    // Create event
    try {

        let user = {
            title: req.body.title,
            description: req.body.description,
            begin_at: req.body.begin_at,
            ends_at: req.body.ends_at,
            userId: req.user.id,
            createdAt: Date.now()
        };

        await addAEvent(user, req, res)
        return res.redirect("/myEvents")

    } catch (err) {

        req.flash('errors', err)

        return res.render("addEvent.ejs", {
            errors: req.flash('errors'),
            form: form
        })
    }

}





module.exports = {
    events: events,
    oneEvent: oneEvent,
    post_event: post_event,
    submbitInterest: submbitInterest,
    getMyBookings: getMyBookings,
    addEvent: addEvent,
    getAddEvent: getAddEvent,
    getMyEvents: getMyEvents,
    deleteEvent: deleteEvent,
    removeBooking: removeBooking
}