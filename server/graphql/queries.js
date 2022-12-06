let resolvers = {
    Query: {
        user: async (_, {uid}, context) => {
            return context.loaders.user.load(uid)
        },
        trip: async (_, {tid}, context) => {
            return context.loaders.trip.load(tid)
        },
    }
}

module.exports = {query_resolvers: resolvers}