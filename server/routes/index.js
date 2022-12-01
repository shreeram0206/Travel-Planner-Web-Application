const express = require('express')
const router = express.Router()


// TODO - Fix routes in this file

// @desc    Landing page
// @method  GET

router.get('/', (req, res) => {
    // res.send('Login')
    res.sendFile('/project/server/views/landing_page.html')
})


// @desc    Dashboard
// @method  GET

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

router.get('/login', (req, res) => {
    res.send('Login')
})


module.exports = router