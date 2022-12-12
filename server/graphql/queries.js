let resolvers = {
    Query: {
        user: async (_, {uid}, context) => {
            return context.loaders.user.load(uid)
        },
        trip: async (_, {tid}, context) => {
            return context.loaders.trip.load(tid)
        },
        getTrips: async (_, {uid}, context) => {
            let trips = await context.loaders.user.load(uid)
            return context.loaders.trip.loadMany(trips.trips.map(id => id.toString()))
        },
    }
}

module.exports = {query_resolvers: resolvers}