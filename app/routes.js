// const controller = require('./controllers/controller');
const { healthCheck } = require('./controllers/healthCheck');
const { signup } = require('./controllers/signup');
const { login } = require('./controllers/login');
const { signupSchema, loginSchema, paginationSchema, validate } = require('./middlewares/validations');
const { checkAuth } = require('./middlewares/users');
const { listAllUsers } = require('./controllers/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [validate(signupSchema)], signup);
  app.post('/users/sessions', [validate(loginSchema)], login);
  app.get('/users', [validate(paginationSchema), checkAuth], listAllUsers);

  // app.get('/endpoi3nt/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
};
