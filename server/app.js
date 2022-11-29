'use strict'

require('dotenv').config()
const path = require('path')
const express = require('express')
const session = require('express-session')
const { graphqlHTTP } = require('express-graphql')
const DataLoader = require('dataloader')
const { readFileSync } = require('fs')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { MongoClient, ObjectId } = require('mongodb')
const passport = require('passport')
const { mongo_bot, mongo_config } = require('./config/db')
mongo_bot.init()

const PORT = process.env.PORT || 3000

// Passport config
require('./config/passport')(passport)

const app = express()

app.use(express.static(path.join(__dirname, 'views')))

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))


// app.use(
//     'graphql',
//     graphqlHTTP({
//         schema,
//         graphiql: true,
//         context: {

//         }
//     })
// )

app.listen(PORT, console.log(`Server started on port ${PORT}`))
