import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/user.js'

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1Id,
  username: 'user1',
  email: 'user1@user.com',
  password: '86theUzer!!',
  tokens: [{
    token: jwt.sign({ _id: user1Id }, process.env.TOKEN)
  }]
}

beforeEach(async () => {
  await User.deleteMany();
  await new User(user1).save();
});

test('Should sign up a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      username: 'user2',
      email: 'user2@user.com',
      password: 'ThisIsLostInTheWoods'
    }).expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    expect(user.password).not.toBe('86theUzer!!');
});

test('Sould login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: user1.email,
      password: user1.password
    }).expect(200);
  
    const user = await User.findById(user1Id);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Sould not login bad user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'dadwawda',
      password: 'ajkndakwfjaefkhjb'
    }).expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/background.jpeg')
    .expect(200)
  const user = await User.findById(user1Id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should delete authenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(user1Id);
  expect(user).toBeNull();
});

test('Should not delete unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should update valid user fields', async ()=> {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
      username: 'UpdatedName'
    })
    .expect(200);
  const user = await User.findById(user1Id);
  expect(user.username).toEqual('UpdatedName');
});

