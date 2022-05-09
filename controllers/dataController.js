const models = require("../models");
const { submit } = require("../services/submitService");
const { addAEvent } = require("../services/addEventService");
const { validationResult } = require("express-validator");
const db = require("../config/session");
const Sequelize = require("sequelize");
const auth = require("../controllers/authController");
const Op = Sequelize.Op;
const fs = require("fs");

const deleteFile = async function (req, res) {
  const fileToDelete = await db.myDatabase.query(
    `SELECT image FROM events WHERE userId = ${req.user.id}`
  );
  if (fileToDelete[0][0].image == "/images/banner_uni.jpg") {
    
  } else {
    fs.unlink(
      `${
        __dirname.replace("controllers", "public") + fileToDelete[0][0].image
      }`,
      function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log("File deleted!");
      }
    );
  }
};

const post_event = function (req, res) {
  models.Event.findAll()
    .then((events) => {
      var isAuth = req.isAuthenticated();
      res.render("post_event", { isAuth: isAuth, data: events });
    })
    .catch((err) => console.log(err));
};

const events = function (req, res) {
  if ([1, 3].includes(req.user.roleId)) {
    var user = req.user;
    models.Event.findAll().then((events) => {
      res.render("book", { user: user, data: events });
    });
  } else {
    res.redirect("/404.ejs");
  }
};

const oneEvent = function (req, res) {
  var isAuth = req.isAuthenticated();
  models.Event.findOne({
    where: { userId: req.user.id },
  }).then((event) => {
    res.render("book", { event: event });
  });
};

const getMyBookings = async function (req, res) {
  var isAuth = req.isAuthenticated();
  query = await db.myDatabase.query(
    `SELECT * FROM events  INNER JOIN attenders_to on attenders_to.eventId = events.id INNER JOIN users on attenders_to.userId = users.id where users.id = ${req.user.id};`
  );
  return res.render("myBookings", { isAuth: isAuth, mybookings: query });
};

let submitInterest = async (req, res) => {
  // Register user to database
  try {
    let user = {
      userId: req.user.id,
      eventId: req.body.eventId,
      createdAt: Date.now(),
    };
    await submit(user, req, res);

    return res.write(
      `<script>window.alert("Registration successful! See you soon!");window.location="/book";</script>`
    );
  } catch (err) {
    return res.write(
      `<script>window.alert("You have already registered to that event!");window.location="/book";</script>`
    );
  }
};

let deleteEvent = function (req, res) {
  if (req.user.roleId === 3) {
    deleteFile(req, res);
    models.Event.findOne({
      where: { id: req.body.id },
    }).then((event) => {
      event.destroy();
      res.write(
        `<script>window.alert("Event has been successfully deleted!");window.location="/manageEvents";</script>`
      );
    });
  } else {
    deleteFile(req, res);
    models.Event.findOne({
      where: { userId: req.user.id },
    }).then((event) => {
      event.destroy();
      res.write(
        `<script>window.alert("Event has been successfully deleted!");window.location="/myEvents";</script>`
      );
    });
  }
};

let removeBooking = function (req, res) {
  models.Attenders_to.findOne({
    where: { eventId: req.body.remove, userId: req.user.id },
  }).then((booking) => {
    booking.destroy();
    res.write(
      `<script>window.alert("Booking has been successfully removed!");window.location="/myBookings";</script>`
    );
  });
};

let getAllEvents = function (req, res, next) {
  if (req.user.roleId == 3) {
    models.Event.findAll().then((events) => {
      res.render("../views/manageEvents.ejs", { events: events });
    });
  } else {
    res.redirect("/404.ejs");
  }
};

let getAllUsers = function (req, res) {
  if (req.user.roleId == 3) {
    models.User.findAll().then((users) => {
      global.globalUsers = users;
      res.render("../views/manageUsers.ejs", { users: users, alert: null });
    });
  } else {
    res.redirect("/404.ejs");
  }
};
let getAllAttenders = async function (req, res, next) {
  if (req.user.roleId == 3) {
    query = await db.myDatabase.query(
      "SELECT firstName, lastName, u.id, e.title  FROM users as u LEFT OUTER JOIN attenders_to as a on u.id = a.userId INNER JOIN events as e on a.eventId = e.id;"
    );
    // Query is returning double results so i had delete one
    delete query[0];
    const newList = query.filter((a) => a);
    global.globalAttenders = newList;
    res.render("../views/manageAttenders.ejs", {
      users: globalAttenders,
      alert: null,
    });
  } else {
    res.redirect("/404.ejs");
  }
};

// Could not figure out why this works on Workbench but here i get firstName, lastName, id but event is null .....
// let getAllAttenders = function(req, res) {
//     models.User.findAll({
//             include: [
//                 { model: models.Attenders_to, attributes: [], required: true, as: "attenders" },
//                 { model: models.Event, attributes: ['title', 'id', 'description'], as: "event" }
//             ],
//             attributes: ['firstName', 'lastName', 'id']

//         })
//         .then(users => {
//             console.log(users);

//             global.globalAttenders = users
//             res.render('../views/manageAttenders.ejs', { users: globalAttenders, alert: null });
//         })
// }

let findUser = function (req, res) {
  let search = req.body.search;
  models.User.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn("lower", Sequelize.col("firstName")), {
          [Op.like]: `%${search}%`,
        }),
        Sequelize.where(Sequelize.fn("lower", Sequelize.col("lastName")), {
          [Op.like]: `%${search}%`,
        }),
        Sequelize.where(Sequelize.fn("lower", Sequelize.col("phone")), {
          [Op.like]: `%${search}%`,
        }),
        Sequelize.where(Sequelize.fn("lower", Sequelize.col("city")), {
          [Op.like]: `%${search}%`,
        }),
        Sequelize.where(Sequelize.fn("lower", Sequelize.col("university")), {
          [Op.like]: `%${search}%`,
        }),
      ],
    },
  }).then((users) => {
    res.render("../views/manageUsers.ejs", { users, users, alert: null });
  });
};

let findAttender = async function (req, res) {
  let search = req.body.search;
  query = await db.myDatabase.query(
    "SELECT firstName, lastName, u.id, e.title  FROM users as u LEFT OUTER JOIN attenders_to as a on u.id = a.userId INNER JOIN events as e on a.eventId = e.id WHERE firstName LIKE " +
      db.myDatabase.escape("%" + search + "%") +
      " OR lastName LIKE " +
      db.myDatabase.escape("%" + search + "%") +
      " OR title LIKE " +
      db.myDatabase.escape("%" + search + "%")
  );
  // Query is returning double results so i had delete one
  delete query[0];
  const newList = query.filter((a) => a);

  global.globalAttenders = newList;

  res.render("../views/manageAttenders.ejs", {
    users: globalAttenders,
    alert: null,
  });
};

let editUser = function (req, res) {
  let sql = `UPDATE users SET firstName = "${req.body.firstName}", lastName ="${req.body.lastName}", email ="${req.body.email}", phone = "${req.body.phone}", city = "${req.body.city}", university = "${req.body.university}" WHERE id = "${req.body.id}"`;
  db.myDatabase.query(sql, function (err) {
    if (err) {
      console.log(err);
    }
  });

  res.write(
    `<script>window.alert("User updated successfully!");window.location="/manageUsers";</script>`
  );
};

let deleteUser = function (req, res) {
  if (req.body.id.toString() === req.user.id.toString()) {
    return res.render("manageUsers", {
      users: globalUsers,
      alert: "You cannot delete yourself",
    });
  } else {
    let query = `DELETE FROM users WHERE id = ${req.body.id}`;
    db.myDatabase.query(query, function (err, data) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/manageUsers");
  }
};

let deleteAttender = function (req, res) {
  let query = `DELETE FROM attenders_to WHERE userId = ${req.body.id}`;
  db.myDatabase.query(query, function (err, data) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/manageAttenders");
};

let getMyEvents = function (req, res) {
  if ([2, 3].includes(req.user.roleId)) {
    let isAuth = req.isAuthenticated();
    models.Event.findOne({
      where: { userId: req.user.id },
    })
      .then((event) => {
        if (event === null) {
          event = false;
          res.render("../views/myEvents.ejs", { event: event, isAuth: isAuth });
        } else {
          res.render("../views/myEvents.ejs", { event: event, isAuth: isAuth });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    res.redirect("/404.ejs");
  }
};

let getAddEvent = async function (req, res) {
  if ([2, 3].includes(req.user.roleId)) {
    let form = {
      title: req.body.title,
      description: req.body.description,
      begin_at: req.body.begin_at,
      ends_at: req.body.ends_at,
      userId: req.user.id,
    };
    var isAuth = req.isAuthenticated();
    return res.render("addEvent.ejs", {
      isAuth: isAuth,
      errors: req.flash("errors"),
      form: form,
    });
  } else {
    res.redirect("/404.ejs");
  }
};

let addEvent = async (req, res) => {
  // Keep old input
  let form = {
    title: req.body.title,
    description: req.body.description,
    begin_at: req.body.begin_at,
    ends_at: req.body.ends_at,
    userId: req.user.id,
  };

  // Check user inputs
  // Create empty array to save error
  let errorsArr = [];
  let validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    var errors = Object.values(validationError.mapped());
    errors.forEach((item) => {
      errorsArr.push(item.msg);
    });
    req.flash("errors", errorsArr);
    return res.render("addEvent.ejs", {
      errors: req.flash("errors"),
      form: form,
    });
  }

  // Create event
  try {
    let user = {
      title: req.body.title,
      description: req.body.description,
      begin_at: req.body.begin_at,
      ends_at: req.body.ends_at,
      userId: req.user.id,
      createdAt: Date.now(),
    };

    await addAEvent(user, req, res);
    return res.redirect("/myEvents");
  } catch (err) {
    req.flash("errors", err);

    return res.render("addEvent.ejs", {
      errors: req.flash("errors"),
      form: form,
    });
  }
};

module.exports = {
  events: events,
  oneEvent: oneEvent,
  post_event: post_event,
  submitInterest: submitInterest,
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
  deleteUser: deleteUser,
  findAttender: findAttender,
  deleteAttender: deleteAttender,
};
