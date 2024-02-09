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
    isAdmin: false,
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
      firstname: "Test",
      lastname: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/check");
    const r = await agent.get("/check");
    const csrfToken2 = extractCsrfToken(r);

    // Send a POST request to create a sports session
    const res1 = await agent.post("/create-session").send({
      sportsName: "Football",
      team1Players: "Player1,Player2",
      team2Players: "Player3,Player4",
      addPlayers: 5,
      date: new Date().toISOString().substring(0, 10),
      time: "15:00",
      venue: "Stadium",
      _csrf: csrfToken2,
    });
    expect(res1.statusCode).toBe(302);
    // Logout
    // res = await agent.get("/signout");
    // expect(res.statusCode).toBe(302);

    // // Verify that user is redirected after logout
    // res = await agent.get("/check");
    // expect(res.statusCode).toBe(302);
  });
  test("Sign out", async () => {
    let res = await agent.get("/check");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/check");
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

  test("Log in", async () => {
    // Perform a GET request to the login page to get the CSRF token
    const loginPageResponse = await agent.get("/login");
    const csrfToken = extractCsrfToken(loginPageResponse);

    // Perform a POST request to submit the login credentials
    const loginResponse = await agent.post("/loginsubmit").send({
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
      isAdmin: false,
    });

    // Check if the login was successful (you may need to adjust this based on your application logic)
    expect(loginResponse.statusCode).toBe(302);

    // After successful login, you can check if the user is redirected to the expected page
    const homePageResponse = await agent.get("/check");
    expect(homePageResponse.statusCode).toBe(200);
  });

  test("Admin Sign Up and Log In", async () => {
    // Perform admin sign-up
    let res = await agent.get("/admin/signup");
    const adminSignupResponse = await agent.post("/admin/signupsubmit").send({
      firstname: "Admin",
      lastname: "User",
      email: "admin@example.com",
      password: "adminpassword",
      _csrf: extractCsrfToken(res),
    });

    expect(adminSignupResponse.statusCode).toBe(302); // Check for successful admin sign-up

    // Perform admin login
    let res1 = await agent.get("/admin/login");
    const adminLoginResponse = await agent.post("/admin/loginsubmit").send({
      email: "admin@example.com",
      password: "adminpassword",
      _csrf: extractCsrfToken(res1),
    });

    expect(adminLoginResponse.statusCode).toBe(302); // Check for successful admin login
  });

  test("Admin Access to Admin Dashboard", async () => {
    // Login as an admin
    let res = await agent.get("/admin/login");
    const adminLoginResponse = await agent.post("/admin/loginsubmit").send({
      email: "admin@example.com",
      password: "adminpassword",
      _csrf: extractCsrfToken(res),
    });

    expect(adminLoginResponse.statusCode).toBe(302);
    expect(adminLoginResponse.header.location).toBe("/adminDashboard");
  });

  test("Filter Sports Sessions Between Dates", async () => {
    // Login as an admin
    let res = await agent.get("/admin/login");
    const adminLoginResponse = await agent.post("/admin/loginsubmit").send({
      email: "admin@example.com",
      password: "adminpassword",
      _csrf: extractCsrfToken(res),
    });

    expect(adminLoginResponse.statusCode).toBe(302);
    let res1 = await agent.get("/adminDashboard");
    // Send a POST request to filter sports sessions between dates
    const filterSessionsResponse = await agent
      .post("/sports-between-dates")
      .send({
        startDate: "2024-02-01",
        endDate: "2024-02-15",
        _csrf: extractCsrfToken(res1),
      });

    expect(filterSessionsResponse.statusCode).toBe(200); // Check for successful filtering of sessions
  });
});
