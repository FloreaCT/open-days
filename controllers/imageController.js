const multer = require('multer')
const path = require('path')
const db = require('../config/session')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/uploadedImages') // './public/images/' directory name where to save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});


const image = (req, res) => {
    if (!req.file) {
        console.log("No file upload");
        res.redirect('/myEvents')
    } else {
        var imgName = '/images/uploadedImages/' + req.file.filename
        var insertData = `UPDATE events SET image = "${imgName}" WHERE userId = ${req.user.id}`

        db.myDatabase.query(insertData, (err, result) => {
            if (err) throw err
        })

        res.redirect('/myEvents')
    }
}

module.exports = { image: image, upload: upload }