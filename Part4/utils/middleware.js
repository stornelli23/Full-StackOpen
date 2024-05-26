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
  logger.error(error.name)

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
  } else if (error.name ===  'JsonWebTokenError') {
    statusCode = 401;
    errorMessage = 'Token missing or invalid'
  }
  response.status(statusCode).json({ error: errorMessage });

  // next(error)
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    request.user = await User.findById(decodedToken.id);
    if (!request.user) {
      return response.status(401).json({ error: 'user not found' });
    }
  } else {
    return response.status(401).json({ error: 'token missing' });
  }
  next();
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}