const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user.js');

// get all users with respective notes
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    important: 1,
  });

  response.json(users);
});

// create a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = usersRouter;
