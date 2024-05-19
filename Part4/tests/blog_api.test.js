const { test, beforeEach, after, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('node:assert');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: "First Blog",
    author: "Author 1",
    url: "http://example.com/1",
    likes: 1
  },
  {
    title: "Second Blog",
    author: "Author 2",
    url: "http://example.com/2",
    likes: 2
  },
  {
    title: "Third Blog",
    author: "Author 3",
    url: "http://example.com/3",
    likes: 1
  }
];

//Different commands to run the tests
// The following command only runs the tests found in the tests/note_api.test.js file:

// npm test -- tests/note_api.test.jscopy
// The --tests-by-name-pattern option can be used for running tests with a specific name:

// npm test -- --test-name-pattern="the first note is about HTTP methods"copy
// The provided argument can refer to the name of the test or the describe block. It can also contain just a part of the name. The following command will run all of the tests that contain notes in their name:

// npm run test -- --test-name-pattern="notes"

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('HTTP GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs');
    assert(response.body.length > 0, 'La respuesta del cuerpo está vacía');
    assert.strictEqual(response.body.length, initialBlogs.length, 'El número de blogs no es igual al esperado');
  });
});

after(async () => {
  await mongoose.connection.close();
});
