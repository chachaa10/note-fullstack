const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const UserModel = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await UserModel.find({}).populate('notes', {
    content: 1,
    important: 1,
  });
  response.json(users);
});

usersRouter.post('/', async (request, response, next) => {
  const { username, password, name } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'username or password missing' });
  }

  if (username.length < 3) {
    return response
      .status(400)
      .json({ error: 'username must be at least 3 characters long' });
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new UserModel({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
