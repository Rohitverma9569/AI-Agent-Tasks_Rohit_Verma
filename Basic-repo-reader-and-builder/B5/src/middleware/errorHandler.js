function notFoundHandler(req, res) {
  res.status(404).json({
    message: "Not found",
    path: req.originalUrl,
  });
}

function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

module.exports = { notFoundHandler, errorHandler };
