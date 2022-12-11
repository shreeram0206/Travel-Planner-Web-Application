'use strict'

const { ObjectId } = require('mongodb')
const { mongo_bot, mongo_config } = require('../config/db')
const { kErrors } = require('../utils/errors')
const { PlacesAPI } = require('../places_api_wrapper')

let place_api = new PlacesAPI()


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
        createTrip: async (_, {trip_input:{destination, admin_id, members}}, context) => {
            let admin_email = await context.loaders.user.load(admin_id)
            let members_map = await Promise.all(members.map(async (member) => {
                let user = await context.db_conn.db.collection(
                    mongo_config.user_collection).findOne({email: member})
                return user.google_id
            }))

            members_map.push(admin_email.google_id)
            let destination_overview = await place_api.getPlaceDetailsByName(destination)
            console.log(destination_overview)
            let trip_obj = {
                destination: destination_overview.id,
                admin_id,
                members: members_map,
                expenses: [],
            }
            console.log(trip_obj)
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
