const supertest = require('supertest');
const { app } = require('../../src/index');
const request = supertest(app);
const { user } = require('./user.json');

test('/cineforum/signUp', async () => {
  const response = await request 
  .post('cineforum/signUp')
  .send(user)
  .expect(201)
  .expect('Content-Type', /application\/json/);
  //expect(response.text).toBe("{\"message\":\"You're confirmed\"}");
});

