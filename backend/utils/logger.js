const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.info(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.info(...params);
  }
};

module.exports = { error, info };
