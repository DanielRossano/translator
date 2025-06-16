export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = {
    success: false,
    error: 'Internal server error'
  };

  // Validation errors
  if (err.name === 'ZodError') {
    error = {
      success: false,
      error: 'Validation error',
      details: err.errors
    };
    return res.status(400).json(error);
  }

  // Database errors
  if (err.name === 'QueryFailedError') {
    error.error = 'Database error';
    return res.status(500).json(error);
  }

  // Custom errors
  if (err.message === 'Translation not found') {
    error.error = err.message;
    return res.status(404).json(error);
  }

  res.status(500).json(error);
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
};
