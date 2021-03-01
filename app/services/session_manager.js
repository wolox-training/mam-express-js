const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require('moment');
const usersService = require('../services/users');
const logger = require('../logger');
const errors = require('../errors');
const NODE_API_SESSION_SECRET = require('../../config').common.session.secret;

exports.checkCredentials = async (email, password) => {
  const registeredUser = await usersService.findByEmail(email);
  if (!registeredUser) {
    logger.error('User not registered');
    throw errors.userNotFoundError('User not registered');
  }
  const storedPassword = registeredUser.dataValues.password;
  const test = bcrypt.compareSync(password, storedPassword);
  if (!test) {
    throw errors.matchCredentialsError('Credentials mismatch');
  }
  return registeredUser.dataValues;
};

exports.generateToken = user => {
  const expiration = moment().add(3600, 'days');
  const token = jwt.encode(
    {
      id: user.id,
      exp: expiration
    },
    NODE_API_SESSION_SECRET
  );
  return {
    token,
    exp: expiration
  };
};
