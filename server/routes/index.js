const express = require('express')
const router = express.Router()

// TODO - Fix routes in this file

// @desc    Landing page
// @method  GET

router.get('/', (req, res) => {
    res.send('Login')
})


// @desc    Dashboard
// @method  GET

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})


module.exports = router