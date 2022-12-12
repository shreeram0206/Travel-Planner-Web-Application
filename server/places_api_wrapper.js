// TODO: Research more about the type parameter and integrate it in the query

const axios = require('axios');
require('dotenv').config()
const { mongo_bot, mongo_config } = require('./config/db')
const { Decorator } = require('./utils/decorators')
const { kErrors } = require('./utils/errors')

// Define base URLs and query parameters
let PLACES_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/'
let PLACES_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/'
let API_KEY_QUERY = `key=${process.env.GOOGLE_PLACES_API_KEY}`



// Wrapper class to handle Google Places API
class PlacesAPI {
    constructor() {}

    async getPlaceId(search_string) {
        let config = {
            method: 'get',
            url: `${PLACES_SEARCH_URL}json?input=${search_string}&inputtype=textquery&${API_KEY_QUERY}`
        }

        let response = await axios(config)
        if (response.data.status == "OK") {
            if (response.data.candidates.length > 0) {
                return response.data.candidates[0].place_id
            }
            else {
                throw new kErrors.kNotFoundError()
            }
        }
        else {
            throw new kErrors.kUnknownError()
        }
    }

    async getPlaceDetailsByID(place_id) {
        let config = {
            method: 'get',
            url: `${PLACES_DETAILS_URL}json?place_id=${place_id}&${API_KEY_QUERY}`
        }

        let response = await axios(config)
        if (response.data.status == "OK") {
            return response.data.result
        }
        else {
            throw new kErrors.kUnknownError()
        }
    }

    async getPlaceDetailsByName(search_string) {
        let place_id = await this.getPlaceId(search_string)
        let { editorial_summary:{overview}, geometry, name} = await this.getPlaceDetailsByID(place_id)
        
        // Change the format of the response and write to DB
        let response = Decorator.PlaceDecorator(place_id, overview, geometry, name)

        let insert_status = await mongo_bot.db.collection(mongo_config.place_collection).insertOne(response)

        return response
    }
}

// place_api = new PlacesAPI()
// place_api.getPlaceDetailsByName('Tahoe').then(r => console.log(r))

module.exports = {
    PlacesAPI
}