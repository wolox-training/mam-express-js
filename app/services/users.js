const bcrypt = require('bcryptjs');
const errors = require('../errors');
const logger = require('../logger');
const userModel = require('../models').users;

const findByEmail = async email => {
  try {
    const user = await userModel.findOne({ where: { email } });
    return user;
  } catch (error) {
    logger.error('Error while trying to get user by email', error.message);
    throw errors.databaseError(error.message);
  }
};
const create = async user => {
  const userExists = await findByEmail(user.email);
  if (userExists) {
    logger.error('This email is already taken');
    throw errors.uniqueEmailError('This email is already taken');
  }

  const password = await bcrypt.hash(user.password, 10);
  const userToStore = { ...user, password };
  await userModel.create(userToStore);
};

module.exports = { create, findByEmail };
