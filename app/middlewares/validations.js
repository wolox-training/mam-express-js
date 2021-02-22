const { validationResult, checkSchema } = require('express-validator');
const { isAlphanumeric } = require('validator');
const errors = require('../errors');

exports.loginSchema = {
  email: {
    in: ['body'],
    exists: true,
    matches: {
      options: /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(wolox)\.(co|com|ar)$/i,
      errorMessage: 'Email must belong to wolox'
    },
    errorMessage: 'Email is required'
  },
  password: {
    in: ['body'],
    exists: true,
    errorMessage: 'Password is required'
  }
};

exports.signupSchema = {
  email: {
    in: ['body'],
    exists: true,
    matches: {
      options: /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(wolox)\.(co|com|ar)$/i,
      errorMessage: 'Email must belong to wolox'
    },
    errorMessage: 'Email is required'
  },
  name: {
    in: ['body'],
    exists: true,
    errorMessage: 'Name is required'
  },
  surname: {
    in: ['body'],
    exists: true,
    errorMessage: 'Surname is required'
  },
  password: {
    in: ['body'],
    exists: true,
    isLength: {
      options: {
        min: 8,
        errorMessage: 'Invalid Password'
      }
    },
    custom: {
      options: value => value && isAlphanumeric(value),
      errorMessage: 'Invalid Password'
    },
    errorMessage: 'Password is required'
  }
};

const throwValidationError = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    return next();
  }
  return next(
    errors.invalidParamsError(validationErrors.array({ onlyFirstError: true }).map(error => error.msg))
  );
};

exports.validate = schema => [checkSchema(schema), throwValidationError];
