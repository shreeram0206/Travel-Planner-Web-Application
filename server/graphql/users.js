'use strict'

let resolvers = {
    User: {
        display_name: ({display_name}, _, context) => {
            return display_name
        },

        fname: ({fname}, _, context) => {
            return fname
        },

        google_id: ({google_id}, _, context) => {
            return google_id
        },

        image: ({image}, _, context) => {
            return image
        },

        lname: ({lname}, _, context) => {
            return lname
        },

        trips: ({trips}, _, context) => {
            return trips
        },

    }
}


module.exports = {user_resolvers: resolvers}
