import { logError, logInfo } from './logger.js';

export const requestLogger = (request, response, next) => {
  logInfo('Method:', request.method);
  logInfo('Path:  ', request.path);
  logInfo('Body:  ', request.body);
  logInfo('---');
  next();
};

export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler = (error, request, response, next) => {
  logError(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }

  next(error);
};
