const models = require('../models')
const { submit } = require('../services/submitService')
const { addAEvent } = require('../services/addEventService')
const { validationResult } = require("express-validator")
const db = require("../config/session")
const Sequelize = require('sequelize');
const auth = require('../controllers/authController')
const Op = Sequelize.Op;



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
    query = await db.myDatabase.query(`SELECT * FROM events  INNER JOIN attenders_to on attenders_to.eventId = events.id INNER JOIN users on attenders_to.userId = users.id where users.id = ${req.user.id};`)
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
    if (req.user.roleId === 3) {
        models.Event.findOne({
            where: { id: req.body.id }
        }).then(event => {
            event.destroy()
            res.write(`<script>window.alert("Event has been successfully deleted!");window.location="/manageEvents";</script>`)
        })
    } else {
        models.Event.findOne({
            where: { userId: req.user.id }
        }).then(event => {
            event.destroy()
            res.write(`<script>window.alert("Event has been successfully deleted!");window.location="/myEvents";</script>`)
        })
    }
}

let removeBooking = function(req, res) {
    models.Attenders_to.findOne({
        where: { eventId: req.body.remove, userId: req.user.id }
    }).then(booking => {
        booking.destroy()
        res.write(`<script>window.alert("Booking has been successfully removed!");window.location="/myBookings";</script>`)
    })
}

let getAllEvents = function(req, res, next) {
    var admin = auth.checkRole(req, res, next)
    if (admin == 3) {
        models.Event.findAll().then(events => {
            res.render('../views/manageEvents.ejs', { events: events })
        })
    }
}

let getAllUsers = function(req, res) {
    models.User.findAll().then(users => {
            global.globalUsers = users
            res.render('../views/manageUsers.ejs', { users: users, alert: null })
        }

    )
}

let getAllAttenders = function(req, res) {
    var admin = auth.checkRole(req, res)
    if (admin == 3) {
        models.Attenders_to.findAll({



        }).then(users => {

                global.globalUsers = users
                res.render('../views/manageAttenders.ejs', { users: users, alert: null })
            }

        )
    }
}

let findUser = function(req, res) {
    let search = req.body.search
    models.User.findAll({
        where: {
            [Op.or]: [
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('firstName')), {
                    [Op.like]: `%${search}%`,
                }),
                Sequelize.where(Sequelize.fn('lower', Sequelize.col('lastName')), {
                    [Op.like]: `%${search}%`,
                }),
            ],
        }
    }).then(users => {
        res.render('../views/manageUsers.ejs', { users, users, alert: null })
    })
}

let editUser = function(req, res) {
    let sql = `UPDATE users SET firstName = "${req.body.firstName}", lastName ="${req.body.lastName}", email ="${req.body.email}", city = "${req.body.city}", university = "${req.body.university}" WHERE id = "${req.body.id}"`;
    db.myDatabase.query(sql, function(err) {
        if (err) {
            console.log(err)
        };
    });

    res.write(`<script>window.alert("User updated successfully!");window.location="/manageUsers";</script>`)
}

let deleteUser = function(req, res) {

    if (req.body.id.toString() === req.user.id.toString()) {
        return res.render('manageUsers', { users: globalUsers, alert: "You cannot delete yourself" });
    } else {
        let sql = `DELETE FROM users WHERE id = ${req.body.id}`
        db.myDatabase.query(sql, function(err, data) {
            if (err) { console.log(err); };
        });
        res.redirect('/manageUsers');
    }
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
    removeBooking: removeBooking,
    getAllEvents: getAllEvents,
    getAllUsers: getAllUsers,
    getAllAttenders: getAllAttenders,
    findUser: findUser,
    editUser: editUser,
    deleteUser: deleteUser
}