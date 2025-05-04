// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] ${err.name || "UnknownError"}: ${message}`);

  res.status(status).json({
    error: {
      message,
      type: err.name || "Error",
    },
  });
}

export default errorHandler;
