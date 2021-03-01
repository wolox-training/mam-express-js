const usersService = require('../services/users');

const listAllUsers = async (req, res, next) => {
  let { page, limit } = req.query;
  page = page || 1;
  limit = limit || 10;
  try {
    const allUsers = await usersService.listUsers(page, limit);
    return res.status(200).json(allUsers);
  } catch (error) {
    return next(error);
  }
};

module.exports = { listAllUsers };
