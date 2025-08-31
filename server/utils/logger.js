export const logInfo = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.info(...params);
  }
};

export const logError = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.info(...params);
  }
};
