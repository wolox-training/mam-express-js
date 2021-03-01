const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.UNIQUE_EMAIL_ERROR = 'unique_email_error';
exports.uniqueEmailError = message => internalError(message, exports.UNIQUE_EMAIL_ERROR);

exports.JOKE_API_ERROR = 'joke_api_error';
exports.jokeApiError = message => internalError(message, exports.JOKE_API_ERROR);

exports.INVALID_PARAMS_ERROR = 'invalid_params_error';
exports.invalidParamsError = message => internalError(message, exports.INVALID_PARAMS_ERROR);

exports.USER_NOT_FOUND_ERROR = 'user_not_found_error';
exports.userNotFoundError = message => internalError(message, exports.USER_NOT_FOUND_ERROR);

exports.MATCH_CREDENTIALS_ERROR = 'match_credentials_error';
exports.matchCredentialsError = message => internalError(message, exports.MATCH_CREDENTIALS_ERROR);

exports.AUTHORIZATION_ERROR = 'authorization_error';
exports.authorizationError = message => internalError(message, exports.AUTHORIZATION_ERROR);
