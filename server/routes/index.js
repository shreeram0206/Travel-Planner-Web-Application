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

router.get('/about',(req, res)=> {
    res.sendFile('/project/server/views/about.html')
})

router.get('/profile',(req, res)=> {
    res.sendFile('/project/server/views/profile.html')
})

router.get('/trip',(req, res)=> {
    res.sendFile('/project/server/views/trip.html')
})

module.exports = router