const express = require('express')

// Express app
const app = express()

// Registering the view
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
        res.render('index')
    })
    // Listen for requests
app.listen(5000)

console.log('I am live on port 5000');