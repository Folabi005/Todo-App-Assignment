const express = require("express");

const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const filter = req.query.status;

    let query = {
      user: req.session.userId,
      status: { $ne: "deleted" },
    };

    if (filter) {
      query.status = filter;
    }

    const tasks = await Task.find(query);

    res.render("index", { tasks });
  } catch (error) {
    next(error);
  }
});

router.post("/create", authMiddleware, async (req, res, next) => {
  try {
    await Task.create({
      title: req.body.title,
      user: req.session.userId,
    });

    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
});

router.post("/complete/:id", authMiddleware, async (req, res, next) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      status: "completed",
    });

    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
});

router.post("/delete/:id", authMiddleware, async (req, res, next) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      status: "deleted",
    });

    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
});

module.exports = router;