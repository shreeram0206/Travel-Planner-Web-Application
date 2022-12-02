const axios = require('axios');
require('dotenv').config()

// Define base URLs and query parameters
let PLACES_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/'
let PLACES_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/'
let API_KEY_QUERY = `key=${process.env.GOOGLE_PLACES_API_KEY}`

// Define custom errors
const kErrors = {
    kNotFoundError: class kNotFoundError extends Error {},
    kUnknownError: class kUnknownError extends Error {},
}


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
            return response.data.result.editorial_summary.overview
        }
        else {
            throw new kErrors.kUnknownError()
        }
    }

    async getPlaceDetailsByName(search_string) {
        let place_id = await this.getPlaceId(search_string)
        let response = await this.getPlaceDetailsByID(place_id)
        return response
    }
}


module.exports = {
    PlacesAPI
}