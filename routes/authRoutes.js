const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    req.session.userId = user._id;

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

    const user = await User.findOne({ username });

    if (!user) {
      return res.send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid credentials");
    }

    req.session.userId = user._id;

    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/login");
});

module.exports = router;