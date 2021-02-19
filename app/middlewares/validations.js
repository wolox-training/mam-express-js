const { body, validationResult } = require('express-validator');

const signupChecks = () => [
  body('name')
    .notEmpty()
    .withMessage('username must not be empty'),
  body('surname')
    .notEmpty()
    .withMessage('surename must not be empty'),
  body('email')
    .matches(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(wolox)\.(co|com|ar)$/)
    .withMessage('The email does not belong to wolox')
    .notEmpty()
    .withMessage('email must not be empty'),
  body('password')
    .notEmpty()
    .withMessage('password must not be empty')
    .isAlpha()
    .withMessage('password must be only alphanumeric')
    .isLength({ min: 8 })
    .withMessage('password must have min 8 characters')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(400).json({
    errors: extractedErrors
  });
};

module.exports = { signupChecks, validate };
