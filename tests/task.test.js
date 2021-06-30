import app from '../src/app.js';
import request from 'supertest';
import Task from '../src/models/task';
import { setupDatabase, user1, user1Id, user2, user2Id, task1, task2, task3 } from './fixtures/db.js';

beforeEach(setupDatabase);

test('Should create a task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
      description: 'from my test suite'
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test('Should return 2 tasks for user1', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test('Should not delete other users tasks', async () => {
  await request(app)
    .delete(`/tasks/${task1._id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404)
  const task = await Task.findById(task1._id);
  expect(task).not.toBe(null);
});