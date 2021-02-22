const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../app');
const usersService = require('../../app/services/users');
const errors = require('../../app/errors');

const request = supertest(app);
const { create: createUser } = require('../factory/users');

let response = {};
let foundUser = {};

const postUser = (endpoint, data) =>
  request
    .post(endpoint)
    .send(data)
    .set('Accept', 'application/json');

describe('[POST] /users', () => {
  describe('request with complete data', () => {
    const userData = {
      name: 'user',
      surname: 'userTest',
      email: 'userTest@wolox.com',
      password: 'userTest'
    };
    beforeAll(async () => {
      jest.setTimeout(15000);
      response = await postUser('/users', userData);
      foundUser = await usersService.findByEmail(userData.email);
    });
    it('It should recieve status 200', () => expect(response.status).toBe(200));
    it('It should recieve "ok" message', () => {
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('ok, user registered');
    });
    it('The user was saved in the DB.', () => expect(foundUser).toBeTruthy());
  });

  describe('request with email already in use', () => {
    const userData = {
      name: 'user',
      surname: 'userTest',
      email: 'userTest@wolox.com',
      password: 'userTest'
    };

    beforeAll(async () => {
      await createUser(userData);
      foundUser = await usersService.findByEmail(userData.email);
      response = await postUser('/users', userData);
    });

    it('The user already exists in the DB.', () => expect(foundUser).toBeTruthy());
    it('Receive status 400', () => expect(response.status).toBe(400));
  });
  describe('with non alphanumeric password', () => {
    const userData = {
      name: 'user',
      surname: 'userTest',
      email: 'userTest@wolox.com',
      password: 'userTest246@'
    };

    beforeAll(async () => {
      response = await postUser('/users', userData);
      foundUser = await usersService.findByEmail(userData.email);
    });

    it('Receive status 400', () => expect(response.status).toBe(400));

    it('Receive a bad password error', () => expect(response.body.message[0]).toBe('Invalid Password'));
  });
  describe('without email, password, name and last_name', () => {
    const bodyParams = ['name', 'surname', 'email', 'password'];
    const userData = {
      name: 'user',
      surname: 'userTest',
      email: 'userTest@wolox.com',
      password: 'userTest'
    };

    const errorsMessage = {
      name: 'Name is required',
      surname: 'Surname is required',
      email: 'Email is required',
      password: 'Password is required'
    };

    bodyParams.forEach(param => {
      describe(`When ${param} is not sent`, () => {
        const createIncompleteUser = { ...userData };
        delete createIncompleteUser[param];
        beforeAll(async () => {
          response = await postUser('/users', createIncompleteUser);
        });

        it(`Receive an error for empty ${param}`, () =>
          expect(response.body.message[0]).toEqual(errorsMessage[param]));

        it('Receive status 400', () => expect(response.status).toBe(400));
      });
    });
  });
});

describe('[POST] /users/sessions', () => {
  const userData = {
    name: 'user',
    surname: 'userTest',
    email: 'userTest@wolox.com',
    password: 'userTest'
  };

  describe('Login sucessfull case', () => {
    const existingUser = {
      email: userData.email,
      password: userData.password
    };

    beforeAll(async () => {
      userData.password = await bcrypt.hash('userTest', 10);
      await createUser(userData);
      response = await postUser('/users/sessions', existingUser);
      foundUser = await usersService.findByEmail(existingUser.email);
    });

    it('User must exists in DB', () => expect(foundUser).toBeTruthy());
    it('Recieve status 200', () => expect(response.status).toBe(200));
    it('Recieve the jwt token', () => expect(response.body).toHaveProperty('token'));
  });

  describe('Credentials mismatch', () => {
    const existingUser = {
      email: userData.email,
      password: userData.password
    };

    beforeAll(async () => {
      userData.password = await bcrypt.hash('userTeste', 10);
      await createUser(userData);
      response = await postUser('/users/sessions', existingUser);
      foundUser = await usersService.findByEmail(existingUser.email);
    });

    it('User must exists in DB', () => expect(foundUser).toBeTruthy());
    it('Recieve status 400', () => expect(response.status).toBe(400));
    it('Recieve credentials mismatch error', () =>
      expect(response.body.internal_code).toEqual(errors.MATCH_CREDENTIALS_ERROR));
  });

  describe('User does not exist in DB', () => {
    const existingUser = {
      email: 'anotheruser@wolox.com',
      password: userData.password
    };

    beforeAll(async () => {
      response = await postUser('/users/sessions', existingUser);
      foundUser = await usersService.findByEmail(existingUser.email);
    });

    it('User must not exist in DB', () => expect(foundUser).toBeFalsy());
    it('Recieve status 404', () => expect(response.status).toBe(404));
    it('Recieve user not found error', () =>
      expect(response.body.internal_code).toEqual(errors.USER_NOT_FOUND_ERROR));
  });
});
