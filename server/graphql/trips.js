'use strict'

const { ObjectId } = require('mongodb')
const { mongo_bot, mongo_config } = require('../config/db')
const { kErrors } = require('../utils/errors')
const { PlacesAPI } = require('../places_api_wrapper')

let place_api = new PlacesAPI()


let resolvers = {
    Trip: {
        _id: async ({_id}, _, context) => {
            return _id
        },
        destination: async ({destination}, _, context) => {
            return context.loaders.place.load(destination)
        },
        members: async ({members}, _, context) => {
            return context.loaders.user.loadMany(members)
        },
        expenses: async ({expenses}, _, context) => {
            return expenses
        },
        admin: async ({admin_id}, _, context) => {
            return context.loaders.user.load(admin_id)
        },
        media: async ({media}, _, context) => {
            if (media) {
                return media.map(m => {return m.Location})
            }
            else {
                return []
            }
        },
    },
    Mutation: {
        createTrip: async (_, {trip_input:{destination, admin_id, members}}, context) => {
            // Get admin's email
            let admin_email = await context.loaders.user.load(admin_id)

            // Get google_ids of members
            let members_map = await Promise.all(members.map(async (member) => {
                let user = await context.db_conn.db.collection(
                    mongo_config.user_collection).findOne({email: member})
                return user.google_id
            }))

            members_map.push(admin_email.google_id)

            // Get details of the place
            let destination_overview = await place_api.getPlaceDetailsByName(destination)

            console.log(destination_overview)

            // Create trip object
            let trip_obj = {
                destination: destination_overview.id,
                admin_id,
                members: members_map,
                expenses: [],
                media: [],
            }


            // Write trip to mongo
            let created = await context.db_conn.db.collection(
                mongo_config.trip_collection).insertOne(trip_obj)
            if (created.insertedId) {

                // Update trips of members
                let update = await context.db_conn.db.collection(
                    mongo_config.user_collection).updateMany(
                        {google_id: {$in: members_map}},
                        {$push: {trips: created.insertedId}}
                    )
                if (update.matchedCount > 0) {
                    context.loaders.user.clearMany(members_map)
                    return context.loaders.trip.load(created.insertedId)
                }
                else {
                    throw new kErrors.kUnknownError()
                }
            }
            else {
                throw new kErrors.kUnknownError()
            }

            

        },
    },
}


module.exports = {trip_resolvers: resolvers}
