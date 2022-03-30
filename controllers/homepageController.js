const { append } = require("express/lib/response")
const userService = require("../services/userService")

var getHomepage = (req, res) => {
    return res.render('index')
}

var getNewUserPage = (req, res) => {
    return res.render("createUser.ejs")
}

var createNewUser = async(req, res) => {
    let user = req.body;
    let message = await userService.createNewUser(user);

    console.log(message);
    return res.redirect("/")
}
module.exports = {
    getHomepage: getHomepage,
    getNewUserPage: getNewUserPage,
    createNewUser: createNewUser
}