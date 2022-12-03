let resolvers = {
    Query: {
        user: async (_, {uid}, context) => {
            return context.loaders.user.load(uid)
        }
    }
}

module.exports = {query_resolvers: resolvers}