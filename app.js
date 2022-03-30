const express = require('express')
const PORT = process.env.PORT || 5000;

// Express app
const app = express()

// Registering the view
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
        res.render('index')
    })
    // Listen for requests
app.listen(PORT)

console.log(`I am live on port: ${PORT}`);