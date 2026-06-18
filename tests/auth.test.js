const request = require("supertest");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");

let app;
let mongoServer;

describe("Auth Routes", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    app = require("../app");
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("GET /login returns 200", async () => {
    const res = await request(app).get("/login");
    expect(res.statusCode).toBe(200);
  });

  test("POST /register creates a new user and redirects", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "test", password: "pass123" });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/tasks");

    const user = await User.findOne({ username: "test" });
    expect(user).not.toBeNull();
    expect(user.username).toBe("test");
  });

  test("POST /login authenticates existing user", async () => {
    const hashed = await bcrypt.hash("pass123", 10);
    await User.create({ username: "test", password: hashed });

    const res = await request(app)
      .post("/login")
      .send({ username: "test", password: "pass123" });

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/tasks");
  });
});