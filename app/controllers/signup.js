const usersService = require('../services/users');

exports.signup = async (req, res, next) => {
  const { name, surname, email, password } = req.body;
  const userToStore = {
    name,
    surname,
    email,
    password
  };
  try {
    await usersService.create(userToStore);
  } catch (err) {
    return next(err);
  }

  return res.status(200).json({
    message: 'ok, user registered'
  });
};
