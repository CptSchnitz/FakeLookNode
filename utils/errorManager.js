const errors = {
  badEmail: 'badEmail',
  badPassword: 'badPassword',
  postDoesntExist: 'postDoesntExist',
  commentDoesntExist: 'commentDoesntExist',
  imageNotFound: 'imageNotFound',
  userNotFound: 'userNotFound',
  userAlreadyExists: 'userAlreadyExists',
};

const errorFactory = (errorType, msg) => {
  const error = new Error(msg);
  error.name = errorType;
  return error;
};

const isSpecificError = (error, errorType) => error.name === errorType;

module.exports = { errors, errorFactory, isSpecificError };
