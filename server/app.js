'use strict'

require('dotenv').config()
const path = require('path')
const express = require('express')
const session = require('express-session')
const { graphqlHTTP } = require('express-graphql')
const DataLoader = require('dataloader')
const { readFileSync } = require('fs')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ObjectId } = require('mongodb')
const passport = require('passport')
const { mongo_bot, mongo_config } = require('./config/db')
const { user_resolvers } = require('./graphql/users')
const { query_resolvers } = require('./graphql/queries')
const { expense_resolvers } = require('./graphql/expenses')
const { trip_resolvers } = require('./graphql/trips')
const { place_resolvers } = require('./graphql/places')

mongo_bot.init()

const PORT = process.env.PORT || 3000
const app = express()

app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile)

app.set('views', path.join(__dirname, 'views'));

// Passport config
require('./config/passport')(passport)


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

// GraphQL section

let graphql_schema = path.join(__dirname, 'schema.graphql')
let typeDefs = readFileSync(graphql_schema).toString('utf-8')

let resolvers = {
    User: user_resolvers.User,
    Trip: trip_resolvers.Trip,
    Expense: expense_resolvers.Expense,
    Place: place_resolvers.Place,
    Query: query_resolvers.Query,
    Mutation: {
        ...expense_resolvers.Mutation,
        ...trip_resolvers.Mutation
    }
}

let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
        requireResolversForAllFields: 'ignore',
        requireResolversToMatchSchema: 'ignore'
    },
})

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
        context: {
            db_conn: mongo_bot,
            loaders: {
                user: new DataLoader(keys => getUsers(mongo_bot, keys)),
                trip: new DataLoader(keys => getTrips(mongo_bot, keys), { cache: false }),
                place: new DataLoader(keys => getPlaces(mongo_bot, keys))
            }
        }
    })
)

async function getUsers(db, keys) {
    // Fetch all documents that have the key as the given google_id
    let users = await db.db.collection(
        mongo_config.user_collection
    ).find({google_id: {$in: keys}}).toArray()

    return keys.map(key => 
        users.find(element => element.google_id === key)
        || new Error(`User with google_id ${key} doesn't exist`))
}


async function getTrips(db, keys) {
    // Convert keys to ObjectId
    keys = keys.map(key => ObjectId(key))

    // Fetch all documents that have the key as the given google_id
    let trips = await db.db.collection(
        mongo_config.trip_collection
    ).find({_id: {$in: keys}}).toArray()

    return keys.map(key => 
        trips.find(element => element._id == key.toString())
        || new Error(`Trip with _id ${key} doesn't exist`))
}

async function getPlaces(db, keys) {
    // Fetch all documents that have the key as the given google_id
    let places = await db.db.collection(
        mongo_config.place_collection
    ).find({id: {$in: keys}}).toArray()

    return keys.map(key => 
        places.find(element => element.id == key)
        || new Error(`Place with _id ${key} doesn't exist`))
}


app.listen(PORT, console.log(`Server started on port ${PORT}`))
