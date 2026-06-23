require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./logger");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on port ${PORT}`);

  if (!MONGO_URI) {
    logger.error("Missing MONGO_URI environment variable. Session persistence and task storage will not work until a database URI is provided.");
    return;
  }

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      logger.info("MongoDB connected");
    })
    .catch((error) => {
      logger.error("MongoDB connection failed", error);
    });
});