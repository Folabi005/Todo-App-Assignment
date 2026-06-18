require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const morgan = require("morgan");

const logger = require("./logger");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const AppError = require("./utils/AppError");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
    },
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.username || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

app.use("/", authRoutes);
app.use("/tasks", taskRoutes);

app.use((req, res, next) => {
  next(new AppError("Endpoint not found", 404));
});

app.use(errorMiddleware);

module.exports = app;

