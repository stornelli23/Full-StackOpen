const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })
  response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
  const { title, author,  url, likes } = request.body;
  const user = request.user

  if (!title || !url) {
      return response.status(400).json({ error: 'Title and url are required' });
    }

  const blog = new Blog({
      title,
      author,
      user: user.id,
      url,
      likes: likes === undefined ? 0 : likes
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog);
 
});

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and url are required' });
  }

    const blog = {
      title,
      author,
      url,
      likes
    }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true})
  
    if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).json({ error: 'Blog not found' });
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'Only the creator can delete this blog' });
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter