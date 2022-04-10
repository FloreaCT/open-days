const models = require('../models')
const { submit } = require('../services/submitService')
const { validationResult } = require("express-validator")
const { application } = require('express')


const post_event = function(req, res) {
    models.Event.findAll()
        .then(events => {
            var isAuth = req.isAuthenticated()
            res.render('post_event', { isAuth: isAuth, data: events });
        })
        .catch(err => console.log(err))
}

const events = function(req, res) {
    var isAuth = req.isAuthenticated()
    models.Event.findAll().then(events => {
        res.render('book', { isAuth: isAuth, data: events })
    })
}

const oneEvent = function(req, res) {
    var isAuth = req.isAuthenticated()
    models.Event.findOne({
        where: { organizerid: req.user.id }
    }).then(event => {
        res.render('book', { event: event })
    })
}

const getMyBookings = function(res, req) {
    models.Event.findAll({
        where: { userid: res.userid },
        include: [{
            model: User,
            where: { userid: res.userid }
        }]
    }).then(mybookings => {
        res.render('myBookings', { isAuth: isAuth, mybookings: mybookings })
    })
}

let submbitInterest = async(req, res) => {

    // Register user to database
    try {
        let user = {
            userid: req.user.id,
            event_id: req.body.uniID,
            createdAt: Date.now()
        };

        await submit(user, req, res)

        return res.redirect("/book")

    } catch (err) {
        return res.write(`<script>window.alert("You have already registered to that event!");window.location="/book";</script>`)
    }
}






module.exports = {
    events: events,
    oneEvent: oneEvent,
    post_event: post_event,
    submbitInterest: submbitInterest,
    getMyBookings: getMyBookings
}