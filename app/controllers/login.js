const sessionManagerService = require('../services/session_manager');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let token = {};
  try {
    const registeredUser = await sessionManagerService.checkCredentials(email, password);
    token = sessionManagerService.generateToken(registeredUser);
    return res.status(200).json(token);
  } catch (error) {
    return next(error);
  }
};
