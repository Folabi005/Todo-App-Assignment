const express = require("express");
const AppError = require("../utils/AppError");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const filter = req.query.status;
    const baseQuery = {
      user: req.session.userId,
      status: { $ne: "deleted" },
    };

    const query = filter ? { user: req.session.userId, status: filter } : baseQuery;
    const tasks = await Task.find(query).sort({ createdAt: -1 });

    const [pendingCount, completedCount] = await Promise.all([
      Task.countDocuments({ user: req.session.userId, status: "pending" }),
      Task.countDocuments({ user: req.session.userId, status: "completed" }),
    ]);

    res.render("index", {
      tasks,
      pendingCount,
      completedCount,
      filter: filter || "all",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/create", authMiddleware, async (req, res, next) => {
  try {
    const title = req.body.title?.trim();

    if (!title) {
      throw new AppError("Task title is required", 400);
    }

    await Task.create({ title, user: req.session.userId });

    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
});

const updateTaskStatus = async (req, res, next, status) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { status },
      { returnDocument: "after" }
    );

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.redirect("/tasks");
  } catch (error) {
    next(error);
  }
};

router.post("/complete/:id", authMiddleware, (req, res, next) => {
  updateTaskStatus(req, res, next, "completed");
});

router.post("/delete/:id", authMiddleware, (req, res, next) => {
  updateTaskStatus(req, res, next, "deleted");
});

module.exports = router;