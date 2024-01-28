const req = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
const { default: expect } = require("expect");
let server, agent;
jest.useFakeTimers("legacy");
// jest.useRealTimers();
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/loginsubmit").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("sports Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = req.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  //signup
  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/signupsubmit").send({
      firstName: "Test",
      lastName: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("Create a sports session - responds with status 302", async () => {
    // Log in a user
    const agent = req.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    // Get CSRF token
    const r = await agent.get("/check");
    const csrfToken = extractCsrfToken(r);

    // Send a POST request to create a sports session
    const res = await agent.post("/create-session").send({
      sportsName: "Football",
      team1Players: "Player1,Player2",
      team2Players: "Player3,Player4",
      addPlayers: 5,
      date: new Date().toISOString().substring(0, 10),
      time: "15:00",
      venue: "Stadium",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("joined", async () => {
    let res = await agent.get("/mySessions");
    expect(res.statusCode).toBe(302);
  });
  //   test("login", async () => {
  //     let res = await agent.get("/joined-sports");
  //     expect(res.statusCode).toBe(200);
  //     res = await agent.get("/signout");
  //     expect(res.statusCode).toBe(302);
  //   });
  //   test("Sign out", async () => {
  //     res = await agent.get("/joined-sports");
  //     expect(res.statusCode).toBe(302);
  //   });
  //   test("Sign up, Login, and Logout", async () => {
  //     let res = await agent.get("/signup");
  //     const csrfToken = extractCsrfToken(res);
  //     res = await agent.post("/signupsubmit").send({
  //       firstName: "Test",
  //       lastName: "User A",
  //       email: "user.a@test.com",
  //       password: "12345678",
  //       _csrf: csrfToken,
  //     });
  //     expect(res.statusCode).toBe(302);

  //     // Login
  //     await login(agent, "user.a@test.com", "12345678");

  //     // Access a protected route (e.g., /check) after login
  //     res = await agent.get("/check");
  //     expect(res.statusCode).toBe(200);

  //     // Logout
  //     res = await agent.get("/signout");
  //     expect(res.statusCode).toBe(302);

  //     // Verify that user is redirected after logout
  //     res = await agent.get("/check");
  //     expect(res.statusCode).toBe(302);
  //   }, 30000);
  //add todo
});
