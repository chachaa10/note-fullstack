import express from 'express';
import mongoose from 'mongoose';
import loginRouter from './controllers/login.js';
import notesRouter from './controllers/notes.js';
import testingRouter from './controllers/testing.js';
import usersRouter from './controllers/users.js';
import { MONGODB_URI } from './utils/config.js';
import { logInfo } from './utils/logger.js';
import {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} from './utils/middleware.js';

const app = express();

// database connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logInfo('connected to MongoDB');
  })
  .catch((error) => {
    error('error connecting to MongoDB:', error.message);
  });

// middleware
app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);

// routes
app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);

// testing
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

// error handling
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
