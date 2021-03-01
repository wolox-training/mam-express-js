const jwt = require('jwt-simple');
const moment = require('moment');
const sessionSecret = require('../../config').common.session.secret;
const errors = require('../errors');

const checkAuth = (req, _, next) => {
  const { authorization } = req.headers;
  if (!authorization) return next(errors.authorizationError('Authorization header not present'));
  const payload = jwt.decode(authorization.replace(/Bearer\s/g, ''), sessionSecret);
  if (!payload) return next(errors.authorizationError('No authorization'));
  if (!moment().isBefore(payload.exp)) return next(errors.authorizationError('No authorization'));
  req.userId = payload.id;
  return next();
};

module.exports = { checkAuth };
