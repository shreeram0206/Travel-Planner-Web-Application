const express = require('express')
const multer = require('multer')
const { ObjectId } = require('mongodb')
const { mongo_bot, mongo_config } = require('../config/db')
const { MulterStorage, storeFilesToS3 } = require('../utils/utils')
const {kErrors} = require('../utils/errors')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { split_expenses } = require('../expense_splitting/expenses')

const router = express.Router()

// Create multer object
const upload = multer({
    storage: MulterStorage,
    limits: {
        files: 10,
        fileSize: 10 * 1024 * 1024
    }
})


// TODO - Fix routes in this file

// @desc    Landing page
// @method  GET

router.get('/', (req, res) => {
    // res.send('Login')
    // res.sendFile('/project/server/views/landing_page.html')
    res.render('landing_page.html', {auth_status: req.isAuthenticated()})
})


router.get('/about',(req, res)=> {
    res.render('about.html')
})


router.get('/profile', ensureAuth, (req, res)=> {
    res.render('profile.html', {uid:req.user.google_id})
})


// @desc    Route to create trip
// @method  GET
// TODO: Add authentication
router.get('/createTrip', ensureAuth, (req, res) => {
    // let data = await mongo_bot.
    console.log(req.user.google_id)
    res.render('create_trip.html', {uid:req.user.google_id})
})


// @desc    Route to see trip
// @method  GET
// TODO: Add Authentication
router.get('/trip/:tid', ensureAuth, async (req, res) => {
    let trip = await mongo_bot.db.collection(mongo_config.trip_collection).findOne({_id: ObjectId(req.params.tid)})
    let splits = split_expenses(trip.members, trip.expenses)
    console.log(splits)
    res.render('trip', {tid:req.params.tid, splits})
})

// @desc    Add media to trip
// @method  POST

// TODO - Handle MulterError (More than allowed number)

router.post(
    '/trip/upload/:tripid', 
    upload.array("media"),
    ensureAuth,
    async (req, res) => {
        console.log(req)
        // Check if trip exists
        let trip = await mongo_bot.db.collection(mongo_config.trip_collection).findOne(
            {_id: ObjectId(req.params.tripid)}
        )
        
        // Send 404 if trip not found
        if (!trip) {
            res.sendStatus(404)
            return
        }

        // Store files to S3
        let store = await storeFilesToS3(req.files, req.params.tripid)

        // Update the mongodb document with the URLs of the uploaded documents
        let update = await mongo_bot.db.collection(mongo_config.trip_collection).updateOne(
            {_id: ObjectId(req.params.tripid)}, {$push: {media: {$each: store}}}
        )

        // Send response based on status of upload
        if (update.matchedCount > 0) {
            
            res.sendStatus(204);
        }
        else {
            res.sendStatus(500);
        }        
    }
)

module.exports = router