const axios = require('axios').default;
const logger = require('../logger');

exports.getRandomJoke = async () => {
  const baseUrl = 'https://geek-jokes.sameerkumar.website/api?format=json';
  try {
    const joke = await axios.get(baseUrl);
    return joke.data;
  } catch (error) {
    logger.error(error);
    throw Error(error);
  }
};
