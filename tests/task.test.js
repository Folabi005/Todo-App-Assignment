const request = require("supertest");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");
const Task = require("../models/Task");

let app;
let agent;
let mongoServer;
let user;

describe("Task Routes", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    app = require("../app");
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    const hashedPassword = await bcrypt.hash("pass123", 10);
    user = await User.create({ username: "taskuser", password: hashedPassword });

    agent = request.agent(app);
    await agent.post("/login").send({ username: "taskuser", password: "pass123" });
  });

  test("GET /tasks renders the task page", async () => {
    const res = await agent.get("/tasks");
    expect(res.statusCode).toBe(200);
  });

  test("POST /tasks/create stores a task", async () => {
    const res = await agent.post("/tasks/create").send({ title: "New Task" });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/tasks");

    const task = await Task.findOne({ title: "New Task", user: user._id });
    expect(task).not.toBeNull();
    expect(task.status).toBe("pending");
  });

  test("POST /tasks/complete/:id updates task to completed", async () => {
    const task = await Task.create({ title: "Complete Me", user: user._id });
    const res = await agent.post(`/tasks/complete/${task._id}`);

    expect(res.statusCode).toBe(302);
    const updated = await Task.findById(task._id);
    expect(updated.status).toBe("completed");
  });

  test("POST /tasks/delete/:id marks a task deleted", async () => {
    const task = await Task.create({ title: "Delete Me", user: user._id });
    const res = await agent.post(`/tasks/delete/${task._id}`);

    expect(res.statusCode).toBe(302);
    const updated = await Task.findById(task._id);
    expect(updated.status).toBe("deleted");
  });
});
