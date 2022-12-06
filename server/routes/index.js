const express = require('express')
const multer = require('multer')
const { ObjectId } = require('mongodb')
const { mongo_bot, mongo_config } = require('../config/db')
const { MulterStorage, storeFilesToS3 } = require('../utils/utils')
const {kErrors} = require('../utils/errors')

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
    res.sendFile('/project/server/views/landing_page.html')
})

router.get('/profile', (req, res) => {
    res.sendFile('/project/server/views/profile.html')
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


// @desc    Add media to trip
// @method  POST

// TODO - Handle MulterError

router.post(
    '/trip/upload/:tripid', 
    upload.array("media"), 
    async (req, res) => {
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