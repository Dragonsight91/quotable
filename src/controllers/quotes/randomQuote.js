const createError = require('http-errors')
const Quotes = require('../../models/Quotes')

/**
 * Get a single random quote
 */
module.exports = async function getRandomQuote(req, res, next) {
  try {
    // Query filters
    const filter = {}

    const [result] = await Quotes.aggregate([
      // Apply filters (if any)
      { $match: filter },
      // Select a random document from the results
      { $sample: { size: 1 } },
      // Only include the following the fields
      { $project: { _id: 1, content: 1, author: 1 } },
    ])

    if (!result) {
      // This should only occur when using filter params
      return next(createError(404, 'Could not find any matching quotes'))
    }
    res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}
