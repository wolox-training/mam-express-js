// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');

const { signup } = require('./controllers/signup');
const { signupChecks, validate } = require('./middlewares/signup_validations');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/signup', signupChecks(), validate, signup);
  // app.get('/endpoi3nt/get/path', [], controller.methodGET);

  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
