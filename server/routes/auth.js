const express = require('express')
const passport = require('passport')
const router = express.Router()


// @desc    Authenticate with google
// @method  GET

router.get('/google', passport.authenticate(
    'google', {scope: ['profile']}
))


// @desc    Google auth callback
// @method  GET

router.get('/google/callback', passport.authenticate(
    'google', {failureRedirect: '/'}
), (req, res) => {
    res.redirect('/dashboard.html')
})


module.exports = router