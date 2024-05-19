const Blog = require('../models/blog')
const app = require('../app');
const supertest = require('supertest');
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

  const blogsInDb = async () => {
    const response = await Blog.find({})
    const blogs = response.map(blog => blog.toJSON())
    return blogs
}

module.exports = {
    api,
    initialBlogs,
    blogsInDb
}