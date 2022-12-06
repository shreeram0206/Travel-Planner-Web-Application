const { ObjectId } = require('mongodb')
const { mongo_bot, mongo_config } = require('../config/db')
const { kErrors } = require('../utils/errors')


let resolvers = {
    Trip: {
        destination: async ({destination}, _, context) => {
            return context.loaders.place.load(destination)
        },
        members: async ({members}, _, context) => {
            return members
        },
        expenses: async ({expenses}, _, context) => {
            return expenses
        },
        admin: async ({admin_id}, _, context) => {
            return context.loaders.user.load(admin_id)
        },
        media: async ({media}, _, context) => {
            return media.map(m => {return m.Location})
        },
    },
    Mutation: {
        createTrip: async (_, {trip_input:{destination, admin_id}}, context) => {
            let trip_obj = {
                destination,
                admin_id,
                members: [],
                expenses: [],
            }
            let created = await context.db_conn.db.collection(
                mongo_config.trip_collection).insertOne(trip_obj)
            if (created.insertedId) {
                return context.loaders.trip.load(created.insertedId)
            }
            else {
                throw new kErrors.kUnknownError()
            }
        },
    },
}


module.exports = {trip_resolvers: resolvers}
