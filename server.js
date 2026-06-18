require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./logger");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  logger.error("Missing MONGO_URI environment variable");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected");
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    logger.error("MongoDB connection failed", error);
    process.exit(1);
  });