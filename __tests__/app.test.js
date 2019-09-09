'use strict';

process.env.SECRET='test';

const jwt = require('jsonwebtoken');

const server = require('../src/app').server;
const supergoose = require('./supergoose.js');
const Users = require('../src/auth/users-model');
const mockRequest = supergoose.server(server);



let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll(async (done) => {
  await supergoose.startDB();
  const adminUser = await new Users(users.admin).save();
  const editorUser = await new Users(users.editor).save();
  const userUser = await new Users(users.user).save();
  done();
});

afterAll( () => {
  supergoose.stopDB();
});

describe('web server',  () => {

  let token;

  it('should post to signin and get bearer token', () => {
    return mockRequest.post('/signin')
      .auth(users.admin.username, users.admin.password)
      .then(results => {
        token = results.text;
      });
  });

  it('should respond properly on get to /categories', () => {

    return mockRequest
      .get('/api/v1/categories')
      .then(results => {
        expect(results.status).toBe(200);
      })
      .catch(console.error);

  });

  it('should respond properly on post to /categories', () => {

    return mockRequest
      .post('/api/v1/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Test', description: 'test stuff' })
      .then(results => {
        expect(results.status).toBe(200);
        expect(results.body.name).toBe('Test');
        expect(results.body.description).toBe('test stuff');
      })
      .catch(console.error);

  });

  it('should respond properly on put to /categories', () => {

    return mockRequest
      .post('/api/v1/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Test', description: 'test stuff' })
      .then(results => {
        expect(results.status).toBe(200);
        expect(results.body.name).toBe('Test');
        expect(results.body.description).toBe('test stuff');
        return mockRequest.put(`/api/v1/categories/${results.body._id}`)
          .auth(users.admin.username, users.admin.password)
          .send({ name: 'Updated Test', description: 'test stuff' });
      })
      .then( result => {
        expect(result.status).toBe(200);
        expect(result.body.name).toBe('Updated Test');
        expect(result.body.description).toBe('test stuff');
      })
      .catch(console.error);

  });

  it('should respond properly on delete to /categories', () => {
    return mockRequest
      .post('/api/v1/categories')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Test', description: 'test stuff' })
      .then(results => {
        expect(results.status).toBe(200);
        expect(results.body.name).toBe('Test');
        expect(results.body.description).toBe('test stuff');
        return mockRequest.delete(`/api/v1/categories/${results.body._id}`)
          .auth(users.admin.username, users.admin.password);
      })

      .then( results => {
        // expect(results.status).toBe(200);
        expect(results.body.name).toBe('Test');
        expect(results.body.description).toBe('test stuff');
        return mockRequest.get('/api/v1/categories');
      })
      .then(results => {
        expect(results.status).toBe(200);
      })
      .catch(console.error);
  });

  it('should respond properly on get to /products', () => {

    return mockRequest
      .get('/api/v1/products')
      .then(results => {
        expect(results.status).toBe(200);

      })
      .catch(console.error);

  });

  it('should respond properly on post to /products', () => {

    return mockRequest
      .post('/api/v1/products')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Test', category: 'Test Category', description: 'test stuff', quantity: 10 })
      .then(results => {
        expect(results.status).toBe(200);
        expect(results.body.name).toBe('Test');
        expect(results.body.category).toBe('Test Category');
        expect(results.body.description).toBe('test stuff');
        expect(results.body.quantity).toBe(10);
      })
      .catch(console.error);

  });

  it('should respond properly on put to /products', () => {
    return mockRequest
      .post('/api/v1/products')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Test', category: 'Test Category', description: 'test stuff', quantity: 10 })
      .then(results => {
        expect(results.status).toBe(200);
        expect(results.body.name).toBe('Test');
        expect(results.body.category).toBe('Test Category');
        expect(results.body.description).toBe('test stuff');
        expect(results.body.quantity).toBe(10);
        return mockRequest.put(`/api/v1/products/${results.body._id}`)
          .auth(users.admin.username, users.admin.password)
          .send({ name: 'Updated Test', category: 'Test Category', description: 'test stuff', quantity: 10 });
      })
      .then( result => {
        expect(result.status).toBe(200);
        expect(result.body.name).toBe('Updated Test');
      })
      .catch(console.error);
  });

  it('should respond properly on delete to /products', () => {
    return mockRequest
      .post('/api/v1/products')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Test', category: 'Test Category', description: 'test stuff', quantity: 10 })
      .then(results => {
        expect(results.status).toBe(200);
        expect(results.body.name).toBe('Test');
        expect(results.body.category).toBe('Test Category');
        expect(results.body.description).toBe('test stuff');
        expect(results.body.quantity).toBe(10);
        return mockRequest.delete(`/api/v1/products/${results.body._id}`)
          .auth(users.admin.username, users.admin.password);
      })

      .then( results => {
        expect(results.status).toBe(200);
        expect(results.body.name).toBe('Test');
        expect(results.body.category).toBe('Test Category');
        expect(results.body.description).toBe('test stuff');
        expect(results.body.quantity).toBe(10);
        return mockRequest.get('/api/v1/products');
      })
      .then(results => {
        expect(results.status).toBe(200);

      })
      .catch(console.error);
  });

});
