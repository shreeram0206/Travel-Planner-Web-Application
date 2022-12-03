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
const { user_resolvers } = require('./graphql/users')
const { query_resolvers } = require('./graphql/queries')

mongo_bot.init()

const PORT = process.env.PORT || 3000
const app = express()

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
    Query: query_resolvers.Query,
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
                user: new DataLoader(keys => getUsers(mongo_bot, keys))
            }
        }
    })
)

async function getUsers(db, keys) {
    // Fetch all documents that have the key as the given google_id
    let users = await db.db.collection(mongo_config.user_collection).find({google_id: {$in: keys}}).toArray()

    return keys.map(key => 
        users.find(element => element.google_id === key)
        || new Error(`User with google_id ${google_id} doesn't exist`))
}


app.listen(PORT, console.log(`Server started on port ${PORT}`))
