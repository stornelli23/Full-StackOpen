const { test, beforeEach, after, describe } = require('node:test');
const mongoose = require('mongoose');
const assert = require('node:assert');
const Blog = require('../models/blog');
const { api, initialBlogs, blogsInDb } = require('./helpers')

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
  
  test('blogs contain id instead of _id', async () => {
      const response = await api.get('/api/blogs');
      const ids = response.body.map(blog => blog.id);
      ids.forEach(id => {
        assert(id !== undefined, 'id is undefined');
      });
    });
});

describe('HTTP POST /api/blogs', ()=>{

    test('a blog successfully created', async ()=>{
        const newBlog = {
            title: "Nuevo Blog",
            author: "Author X",
            url: "http://example.com/x",
            likes: 3
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const response = await blogsInDb()
        const titles = response.map(blog => blog.title)

        assert.strictEqual(response.length, initialBlogs.length + 1)
        assert(titles.includes('Nuevo Blog'))

    })

    test('if the likes property is missing, it will default to zero', async ()=>{
        const newBlog = {
            title: "New Blog",
            author: "Author",
            url: "http://example.com"
          };
      
          const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
      
          const createdBlog = response.body;
          assert.strictEqual(createdBlog.likes, 0, 'The default value for likes should be 0');
    })

    test('if the title is missing, responds with 400 Bad Request', async () => {
        const newBlog = {
          author: "Author",
          url: "http://example.com"
        };
    
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/);
      });
    
      test('if the url is missing, responds with 400 Bad Request', async () => {
        const newBlog = {
          title: "New Blog",
          author: "Author"
        };
    
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/);
      });
})

describe('HTTP GET by ID /api/blogs/:id', ()=>{

    test('a specific blog can be viewed', async () => {
        const blogs = await blogsInDb()
        const blogToView = blogs[0]
      
        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      
        assert.deepStrictEqual(resultBlog.body, blogToView)
      })
})

describe('HTTP DELETE /api/blogs/:id', ()=>{
     
    test('a blog can be deleted', async () => {
        const blogs = await blogsInDb()
        const blogToDelete = blogs[0]
    
        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
        const blogsAtEnd = await blogsInDb()
        const titles = blogsAtEnd.map(blog => blog.title)

        assert(!titles.includes(blogToDelete.title))
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)
    })

    test('a blog that do not exist can not be deleted', async ()=>{
        await api
        .delete('/api/notes/1234')
        .expect(404)
        
        const blogsAtEnd = await blogsInDb()
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
    })
})

describe('HTTP PUT /api/blogs/:id', ()=>{
    
    test('a blog can be updated', async () => {
        const blogsAtStart = await blogsInDb();
        const blogToUpdate = blogsAtStart[0];
    
        const updatedBlogData = {
          title: 'Updated Title',
          author: blogToUpdate.author,
          url: blogToUpdate.url,
          likes: blogToUpdate.likes + 1,
        };
    
        const result = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(updatedBlogData)
          .expect(200)
          .expect('Content-Type', /application\/json/);
    
        assert.strictEqual(result.body.title, updatedBlogData.title);
        assert.strictEqual(result.body.likes, updatedBlogData.likes);
      });
    
      test('updating a blog with missing title or url returns 400', async () => {
        const blogsAtStart = await blogsInDb();
        const blogToUpdate = blogsAtStart[0];
    
        const updatedBlogData = {
          author: blogToUpdate.author,
          likes: blogToUpdate.likes + 1,
        };
    
        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(updatedBlogData)
          .expect(400)
          .expect('Content-Type', /application\/json/);
    
        const blogsAtEnd = await blogsInDb();
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
    
        const blogAtEnd = blogsAtEnd.find(b => b.id === blogToUpdate.id);
        assert.strictEqual(blogAtEnd.title, blogToUpdate.title);
        assert.strictEqual(blogAtEnd.likes, blogToUpdate.likes);
      });
})


after(async () => {
  await mongoose.connection.close();
});

