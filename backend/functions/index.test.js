const request = require("supertest");
const {app, server} = require("./index");

const API_KEY = process.env.CREATE_API_KEY;

// Global test data & variables


const userData = {
          name: "testUserFromJest",
          email: "test@example.com",
          user_id: "testUserFromJest",
        };

const friendData = {
    name: "testFriendFromJest",
    email: "testfriend@example.com",
    user_id: "testFriendFromJest",
};

const taskData = {
  title: "Jest Test Task",
  description: "Jest Test Task Description",
  details: "Jest Test Task Details",
  status: "incomplete",
  due_date: new Date().getTime(),
  priority: "high",
  user_id: userData.user_id,
};

let testTaskId;

console.log("==== RUNNING TESTS ====");


// POST /api/create-user tests
describe("POST /api/create-user", () => {
  it("Should not allow unauthorised access", async () => {
    const res = await request(app)
      .post("/api/create-user")
      .send(userData);
    expect(res.statusCode).toEqual(401);
  });
    it("Should return response 200", async () => {
        const res = await request(app)
        .post("/api/create-user")
        .set("x-api-key", API_KEY)
        .send(userData);
        expect(res.statusCode).toEqual(201);
        const friendRes = await request(app)
          .post("/api/create-user")
          .set("x-api-key", API_KEY)
          .send(friendData);
        expect(friendRes.statusCode).toEqual(201);
    }, 10000);
});

// GET user data tests
describe("GET api/user/:userId", () => {
    it("Should not allow unauthorised access", async () => {
      const res = await request(app).get("/api/user/lsdiauc");
      expect(res.statusCode).toEqual(401);
    });
    it("Should return response 200", async () => {
      const res = await request(app)
        .get(`/api/user/${userData.user_id}`)
        .set("x-api-key", API_KEY);
      expect(res.statusCode).toEqual(200);
    });
    it("Must return the correct user data", async () => {
        const res = await request(app)
            .get(`/api/user/${userData.user_id}`)
            .set("x-api-key", API_KEY);
        expect(res.body.name).toEqual(userData.name);
        expect(res.body.email).toEqual(userData.email);
        expect(res.body.user_id).toEqual(userData.user_id);
        expect(res.body).toHaveProperty("score");
        expect(res.body).toHaveProperty("last_task_completed_date");
        expect(res.body).toHaveProperty("task_day_streak");
        expect(res.body).toHaveProperty("task_week_streak");
    });
});

// GET user's dashboard tests
describe("GET /api/dashboard/:userId", () => {
  it("Should not allow unauthorised access", async () => {
    const res = await request(app).get("/api/dashboard/lksdjvsdvlkj");
    expect(res.statusCode).toEqual(401);
  });
  it("Should return response 200", async () => {
    const res = await request(app)
      .get(`/api/dashboard/${userData.user_id}`)
      .set("x-api-key", API_KEY);
    expect(res.statusCode).toEqual(200);
  });
  
});

// GET search other users by name
describe("GET /api/search-friends/", () => {
    it("Should not allow unauthorised access", async () => {
        const res = await request(app).get(
          `/api/search-friend/${friendData.name}`
        );
        expect(res.statusCode).toEqual(401);
    });
    it("Should return response 200", async () => {
        const res = await request(app)
        .get(`/api/search-friend/${friendData.name}`)
        .set("x-api-key", API_KEY);
        expect(res.statusCode).toEqual(200);
    });
    it("Should return the correct friend data", async () => {
        const res = await request(app)
        .get(`/api/search-friend/${friendData.name}`)
        .set("x-api-key", API_KEY);
        expect(res.body[0].name).toEqual(friendData.name);
        expect(res.body[0].user_id).toEqual(friendData.user_id);
        expect(res.body[0]).toHaveProperty("score");
    });
});

// POST add friends tests
describe("POST /api/add-friend", () => {
  it("Should not allow unauthorised access", async () => {
    const res = await request(app)
      .post("/api/add-friend")
      .send({ userId: userData.user_id, friendId: friendData.user_id });
    expect(res.statusCode).toEqual(401);
  });
  it("Should return response 201", async () => {
    const res = await request(app)
      .post("/api/add-friend")
      .set("x-api-key", API_KEY)
      .send({ userId: userData.user_id, friendId: friendData.user_id });
    expect(res.statusCode).toEqual(201);
  });
});

// POST add task tests
describe("POST /api/add-task", () => {
  it("Should not allow unauthorised access", async () => {
    const res = await request(app)
      .post("/api/new-task")
      .send(taskData);
    expect(res.statusCode).toEqual(401);
  });
  it("Should return response 201", async () => {
    const res = await request(app)
      .post("/api/new-task")
      .set("x-api-key", API_KEY)
      .send(taskData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("docId");
    expect(res.body.task).toEqual(taskData.title);
  });
});

// GET user's tasks tests
describe("GET /api/tasks/:userId", () => {
  it("Should not allow unauthorised access", async () => {
    const res = await request(app).get(`/api/tasks/user/${userData.user_id}`);
    expect(res.statusCode).toEqual(401);
  });
  it("Should return response 200", async () => {
    const res = await request(app)
      .get(`/api/tasks/user/${userData.user_id}`)
      .set("x-api-key", API_KEY);
    expect(res.statusCode).toEqual(200);
  });
  it("Should return an array of tasks", async () => {
    const res = await request(app)
      .get(`/api/tasks/user/${userData.user_id}`)
      .set("x-api-key", API_KEY);
    expect(res.body[0].user_id).toEqual(userData.user_id);
    expect(res.body[0].title).toEqual(taskData.title);
    expect(res.body[0].description).toEqual(taskData.description);
    expect(res.body[0].details).toEqual(taskData.details);
    expect(res.body[0].status).toEqual(taskData.status);
    expect(res.body[0].priority).toEqual(taskData.priority);
    expect(res.body[0].due_date).toEqual(taskData.due_date);
    expect(res.body[0]).toHaveProperty("id");
    testTaskId = res.body[0].id;
  });
  it("Should return a single task", async () => {
    const res = await request(app)
      .get(`/api/task/${testTaskId}/user/${userData.user_id}`)
      .set("x-api-key", API_KEY);
    expect(res.body.user_id).toEqual(userData.user_id);
    expect(res.body.title).toEqual(taskData.title);
    expect(res.body.description).toEqual(taskData.description);
    expect(res.body.details).toEqual(taskData.details);
    expect(res.body.status).toEqual(taskData.status);
    expect(res.body.priority).toEqual(taskData.priority);
    expect(res.body.due_date).toEqual(taskData.due_date);
  });
});

// PUT update task tests
describe("PUT /api/task/:taskId/user/:userId", () => {
  const updatedTaskData = {
    title: "Jest Test Task Updated",
    description: "Jest Test Task Description Updated",
    details: "Jest Test Task Details Updated",
    status: "complete",
    due_date: new Date().getTime(),
    priority: "low",
  };

  it("Should not allow unauthorised access", async () => {
    const res = await request(app)
      .put(`/api/task/${testTaskId}/user/${userData.user_id}`)
      .send(updatedTaskData);
    expect(res.statusCode).toEqual(401);
  });
  it("Should return response 200", async () => {
    const res = await request(app)
      .put(`/api/task/${testTaskId}/user/${userData.user_id}`)
      .set("x-api-key", API_KEY)
      .send(updatedTaskData);
    expect(res.statusCode).toEqual(200);
  });
});

// PUT complete task tests
describe("PUT /api/user/:userId/complete-task/:taskId", () => {
  it("Should not allow unauthorised access", async () => {
    const res = await request(app).put(
      `/api/user/${userData.user_id}/complete-task/${testTaskId}`
    );
    expect(res.statusCode).toEqual(401);
  });
  it("Should return response 200", async () => {
    const res = await request(app)
      .put(`/api/user/${userData.user_id}/complete-task/${testTaskId}`)
      .set("x-api-key", API_KEY);
    expect(res.statusCode).toEqual(200);
  });
});

// DELETE task tests
describe("DELETE /api/user/:userId/task/:taskId", () => {
  it("Should not allow unauthorised access", async () => {
    const res = await request(app).delete(`/api/user/${userData.user_id}/task/${testTaskId}`);
    expect(res.statusCode).toEqual(401);
  });
  it("Should return response 204", async () => {
    const res = await request(app)
      .delete(`/api/user/${userData.user_id}/task/${testTaskId}`)
      .set("x-api-key", API_KEY);
    expect(res.statusCode).toEqual(204);
  });
});

// DELETE user tests
describe("DELETE /api/delete-user/:userId", () => {
  it("Should not allow unauthorised access", async () => {
    const res = await request(app).delete("/api/user/lsdiauc");
    expect(res.statusCode).toEqual(401);
  });
  it("Should return response 204", async () => {
    const res = await request(app)
      .delete(`/api/user/${userData.user_id}`)
      .set("x-api-key", API_KEY);
    expect(res.statusCode).toEqual(204);
    const friendRes = await request(app)
      .delete(`/api/user/${friendData.user_id}`)
      .set("x-api-key", API_KEY);
    expect(friendRes.statusCode).toEqual(204);
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


