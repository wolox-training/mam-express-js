const bcrypt = require('bcryptjs');
const userModel = require('../models').user;

const signup = async user => {
  const userExists = await userModel.findOne({ where: { email: user.email } });
  if (userExists) {
    throw Error('This is email has been already taken');
  }

  const password = await bcrypt.hash(user.password, 10);
  const userToStore = { ...user, password };
  await userModel.create(userToStore);
};

module.exports = { signup };
