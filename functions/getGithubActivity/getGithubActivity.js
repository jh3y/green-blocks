/* eslint-disable */
const cheerio = require('cheerio')
const fetch = require('node-fetch')

const MESSAGES = {
  USERNAME: username => `Username "${username}" does not exist`,
}

// Merely to check that the username exists
const validateConfig = async (username) => {
  const userRequest = await fetch(`https://github.com/${username}`)
  if (userRequest.status !== 200) throw Error(MESSAGES.USERNAME(username))
  return false
}

const getCommits = async (username) => {
  // Grab the page HTML
  const PAGE = await (
    await fetch(`https://github.com/users/${username}/contributions`)
  ).text()
  // Use Cheerio to parse the highest commit count for a day
  const $ = cheerio.load(PAGE)
  // Instantiate an Array
  const COUNTS = []
  // Grab all the commit days from the HTML
  const COMMIT_DAYS = $('[data-count]')
  // Loop over the commit days and grab the "data-count" attribute
  // Push it into the Array
  COMMIT_DAYS.each((DAY) => {
    COUNTS.push(parseInt(COMMIT_DAYS[DAY].attribs['data-count'], 10))
  })
  return COUNTS
}
exports.handler = async (event) => {
  try {
    const { username } = event.queryStringParameters
    await validateConfig(username)
    const commits = await getCommits(username)
    return {
      statusCode: 200,
      body: JSON.stringify({ commits }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    }
  }
}