const supertest = require('supertest');
// const bcrypt = require('bcryptjs');
const app = require('../../app');
const sessionService = require('../../app/services/session_manager');
const usersService = require('../../app/services/users');
const errors = require('../../app/errors');

const request = supertest(app);
const { create: createUser } = require('../factory/users');

let authToken = '';
let foundUser = {};
let response = {};

const getUsers = (endpoint, token) =>
  request
    .get(endpoint)
    .set('Authorization', `Bearer ${token}`)
    .send()
    .set('Accept', 'application/json');

describe('[GET] /users', () => {
  const userData = {
    name: 'user',
    surname: 'userTest',
    email: 'userTest@wolox.com',
    password: 'userTest'
  };
  beforeAll(async () => {
    await createUser(userData);
    foundUser = await usersService.findByEmail(userData.email);
    authToken = sessionService.generateToken(foundUser.dataValues);
  });
  describe('When Authorization header is not present', () => {
    beforeAll(async () => {
      const users = [];
      for (let i = 0; i < 20; i++) {
        users.push(createUser());
      }
      await Promise.all(users);
      response = await request
        .get('/users?page=1&limit=4')
        .send()
        .set('Accept', 'application/json');
    });
    it('Should return code 401', () => expect(response.statusCode).toBe(401));
    it('Should return an Authorization error message', () =>
      expect(response.body.internal_code).toBe(errors.AUTHORIZATION_ERROR));
  });

  describe('When Authorization header is present', () => {
    beforeAll(async () => {
      const users = [];
      for (let i = 0; i < 20; i++) {
        users.push(createUser());
      }
      await Promise.all(users);
      response = await getUsers('/users?page=1&limit=4', authToken.token);
    });
    it('should return status code 200', () => expect(response.statusCode).toBe(200));
    it('It must return an array of users', () => expect(response.body.length).toBe(4));
  });
});
