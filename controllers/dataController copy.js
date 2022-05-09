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
        where: { userId: req.user.id }
    }).then(event => {
        res.render('book', { event: event })
    })
}

const getMyBookings = function(req, res) {
    var isAuth = req.isAuthenticated()
    models.Attenders_to.findAll({
        where: { userId: req.user.id },
        include: [{
            model: models.Event,
            attibutes: ['description'],
            where: {
                userId: id

            }
        }]
    }).then(mybookings => {
        res.render('myBookings', { isAuth: isAuth, mybookings: mybookings })
    })
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