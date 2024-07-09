const request = require("supertest");
const {app, server} = require("./index");

const API_KEY = process.env.CREATE_API_KEY;

const userData = {
          name: "testUserFromJest",
          email: "test@example.com",
          user_id: "testUserFromJest",
        };


// POST /api/create-user tests
describe("POST /api/create-user", () => {
  it("It should not allow unauthorised access", async () => {
    const res = await request(app)
      .post("/api/create-user")
      .send(userData);
    expect(res.statusCode).toEqual(401);
  });
    it("It should return response 200", async () => {
        const res = await request(app)
        .post("/api/create-user")
        .set("x-api-key", API_KEY)
        .send(userData);
        expect(res.statusCode).toEqual(201);
    });
});

// GET user's dashboard tests
describe( "GET /api/dashboard", () => {
    it("It should not allow unauthorised access", async () => {
        const res = await request(app).get("/api/dashboard/lksdjvsdvlkj");
        expect(res.statusCode).toEqual(401);
    })
    it("It should return response 200", async () => {
      const res = await request(app)
        .get("/api/dashboard/lksdjvsdvlkj")
        .set("x-api-key", API_KEY);
      expect(res.statusCode).toEqual(200);
    });
});

// DELETE user tests
describe("DELETE /api/delete-user", () => {
  it("It should not allow unauthorised access", async () => {
    const res = await request(app).delete("/api/user/lsdiauc");
    expect(res.statusCode).toEqual(401);
  });
    it("It should return response 204", async () => {
        const res = await request(app)
            .delete(`/api/user/${userData.user_id}`)
            .set("x-api-key", API_KEY);
        expect(res.statusCode).toEqual(204);

    });
});


afterAll((done) => {
  // If you have a server instance running, close it
  if (server && server.close) {
    server.close(() => {
      console.log("Server closed");
      done();
    });
  } else {
    // If there's no server to close, just call done
    done();
  }
});


