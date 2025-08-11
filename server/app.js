import express from 'express';
import mongoose from 'mongoose';
import loginRouter from './controllers/login.js';
import notesRouter from './controllers/notes.js';
import usersRouter from './controllers/users.js';
import { MONGODB_URI } from './utils/config.js';
import logger from './utils/logger.js';
import middleware from './utils/middleware.js';

const app = express();

// database connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

// middleware
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

// routes
app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

// error handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
