const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { 
      title: 1, 
      author: 1,
      url: 1
      })

      
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password) {
      return response.status(400).json({ error: 'Both username and password must be provided' });
    }

    if (username.length < 3 || password.length < 3) {
      return response.status(400).json({ error: 'Username and password must be at least 3 characters long' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(400).json({ error: '`Username` must to be unique' });
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
  })

usersRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'Both username and password must be provided' });
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Username and password must be at least 3 characters long' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser && existingUser._id.toString() !== id) {
    return response.status(400).json({ error: 'Username must be unique' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { username, name, passwordHash },
    { new: true, runValidators: true, context: 'query' }
  );

  if (!updatedUser) {
    return response.status(404).json({ error: 'User not found' });
  }

  response.json(updatedUser);
});

usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return response.status(404).json({ error: 'User not found' });
  }

  response.status(204).end();
});

module.exports = usersRouter