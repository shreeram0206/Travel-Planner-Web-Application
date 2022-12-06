// Define custom errors
const kErrors = {
    kNotFoundError: class kNotFoundError extends Error {},
    kUnknownError: class kUnknownError extends Error {},
}


module.exports = { kErrors }