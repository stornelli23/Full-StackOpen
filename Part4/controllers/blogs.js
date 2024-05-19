const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
      return response.status(400).json({ error: 'Title and url are required' });
    }

  const blog = new Blog({
      title,
      author,
      url,
      likes: likes === undefined ? 0 : likes
  });

  const result = await blog.save();
  response.status(201).json(result);
 
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
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = blogsRouter