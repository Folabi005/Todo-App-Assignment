const logger = require("../logger");

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  logger.error(message, err.stack || err);

  if (req.accepts("html")) {
    return res.status(status).render("error", {
      status,
      message,
    });
  }

  res.status(status).json({ status: "error", message });
};