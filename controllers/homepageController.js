const { append } = require("express/lib/response")

var getHomepage = (req, res) => {
    return res.render('index')
}

module.exports = { getHomepage: getHomepage }