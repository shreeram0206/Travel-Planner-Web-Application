'use strict'
const { ObjectId } = require('mongodb')
const { mongo_bot, mongo_config } = require('../config/db')
const { kErrors } = require('../utils/errors')


let resolvers = {
    Expense: {
        title: async ({title}, _, context) => {
            return title
        },
        amount: async ({amount}, _, context) => {
            return amount
        },
        paid_by: async ({paid_by}, _, context) => {
            return context.loaders.user.load(paid_by)
        },
        included_members: async ({included_members}, _, context) => {
            return context.loaders.user.loadMany(included_members)
        },
    },
    Mutation: {
        addExpense: async (_, {expense_input:{trip_id, title, amount, paid_by, included_members}}, context) => {
            let expense_obj = {
                title,
                amount,
                paid_by,
                included_members
            }
            let update = await mongo_bot.db.collection(
                mongo_config.trip_collection
                ).updateOne({_id: ObjectId(trip_id)}, 
                            {$push: {expenses: expense_obj}})
            if (update.matchedCount > 0) {
                // context.loaders.trip.clear(trip_id)
                return expense_obj
            }
            else {
                throw new kErrors.kNotFoundError()
            }
        },
    }
}


module.exports = {expense_resolvers: resolvers}
