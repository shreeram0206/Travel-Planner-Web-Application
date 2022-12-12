const { ObjectId } = require('mongodb')
const { mongo_bot, mongo_config } = require('../config/db')
const { kErrors } = require('../utils/errors')


let resolvers = {
    Place: {
        id: async ({id}, _, context) => {
            return id
        },
        overview: async ({overview}, _, context) => {
            return overview
        },
        lat: async ({lat}, _, context) => {
            return lat
        },
        lng: async ({lng}, _, context) => {
            return lng
        },
        name: async ({name}, _, context) => {
            return name
        },
    }
}


module.exports = {place_resolvers: resolvers}