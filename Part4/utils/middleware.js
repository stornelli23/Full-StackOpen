const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---------------------------------')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  if (error.name === 'CastError') {
    statusCode = 400;
    errorMessage = 'Malformatted id';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = error.message;
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    statusCode = 400;
    errorMessage = 'Expected `username` to be unique';
  }

  response.status(statusCode).json({ error: errorMessage });

  // next(error)
};


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}