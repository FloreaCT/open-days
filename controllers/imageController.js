const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/') // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});


const image = app.post("/upload", upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
        var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
        db.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
        })
        res.write(`<script>window.alert("Image uploaded successfully!");window.location="/book";</script>`)
        return res.redirect('/myEvents')
    }
})

model.exports = { image: image }