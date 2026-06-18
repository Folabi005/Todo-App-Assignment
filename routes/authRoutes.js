const express = require("express");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const User = require("../models/User");

const router = express.Router();

const setFlash = (req, type, message) => {
  req.session.flash = { type, message };
};

router.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/tasks");
  }
  res.redirect("/login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      setFlash(req, "error", "Username and password are required");
      return res.redirect("/register");
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
      setFlash(req, "error", "User already exists");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      setFlash(req, "error", "Username and password are required");
      return res.redirect("/login");
    }

    const user = await User.findOne({ username });

    if (!user) {
      setFlash(req, "error", "Invalid credentials");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      setFlash(req, "error", "Invalid credentials");
      return res.redirect("/login");
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;