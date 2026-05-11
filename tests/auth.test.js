const request = require("supertest");

const app = require("../app");

describe("Auth Routes", () => {
  test("GET /login", async () => {
    const res = await request(app).get("/login");

    expect(res.statusCode).toBe(200);
  });
});