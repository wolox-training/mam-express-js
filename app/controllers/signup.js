const usersService = require('../services/signup');
const logger = require('../logger');

exports.signup = async (req, res) => {
  const { name, surname, email, password } = req.body;
  const userToStore = {
    name,
    surname,
    email,
    password
  };
  try {
    await usersService.signup(userToStore);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ error: err.message, status_code: 500 });
  }

  return res.status(200).json({
    message: 'ok, user registered'
  });
};
