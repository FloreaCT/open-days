app.use(function(req, res, next) {
    let login = req.isAuthenticated();
    next();
});