const axios = require('axios').default;
const logger = require('../logger');
const errors = require('../errors');

exports.getRandomJoke = async () => {
  const baseUrl = 'https://geek-jokes.sameerkumar.website/api?format=json';
  try {
    const joke = await axios.get(baseUrl);
    return joke.data;
  } catch (error) {
    logger.error('Error while getting random joke', error.message);
    throw errors.jokeApiError(error.message);
  }
};
