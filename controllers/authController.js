let checkLoggedIn = (req, res, next) => {
    if (!req.isAutehnticated()) {
        return res.redirect('/login')
    }
    next()
}

let checkLoggedOut = (req, res, next) => {
    if (req.isAutehnticated()) {
        return res.redirect('/')
    }
    next()
}

let postLogOut = (req, res) => {
    req.session.destroy(function(error) {
        return res.redirect('/login')
    })
}

module.exports = {
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut
}