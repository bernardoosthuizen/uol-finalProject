/**
 ---------- SOCIAL TASKER ----------
 ---------- API Endpoints ----------
 */

const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const { param, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { userValidator, idValidator, taskValidator, apiKeyMiddleware } = require("./validators");
const neo4j = require("neo4j-driver");
const { rateLimit } = require("express-rate-limit");

require("dotenv").config();


// For local testing only. Not required in production.
// -------------------------------------------------------
const admin = require("firebase-admin");
const serviceAccount = require("../../uol-fp-firebase-adminsdk-h1olz-34e8ea07cc.json");
// -------------------------------------------------------

// Initialize Firebase Admin
initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "uol-fp",
  databaseURL: "https://uol-fp-default-rtdb.europe-west1.firebasedatabase.app/",
});

// Initialize Neo4j driver
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

// Initialize Firestore database
const db = admin.firestore();
const realtimeDb = admin.database();



// Initialize express server
const app = express();
// Adding middleware to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set up rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// Apply rate limiter to all requests
app.use(limiter);


// -------------------------------------------------------
// --------------   API endpoints ------------------------

// Create a new user
app.post("/new-user",apiKeyMiddleware, userValidator, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  // Return validation errors if any
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  // Extract user data from request body
  const {user_id, name, email} = req.body;
  const userData = {user_id, name, email};

  // Add to firestore database
  db.collection("users")
    .doc(user_id)
    .set(userData)
    .then(() => {
      console.log("User added to Firestore database");
      // Add user to Neo4j database
      session
        .run("CREATE (u:User {user_id: $user_id, name: $name, score: $score}) RETURN u", {
          user_id: user_id,
          name: name,
          score: 0,
        })
        .then(() => {
          // Create task collection for user in firestore
          const collectionName = `tasks-${user_id}`;
          db.collection(collectionName)
            .doc()
            .set({ title: "Sample task" })
            .then(() => {
              console.log("Sample task added to Firestore realtime database")
              // Send response
              // create firebase realtime database entry

              
              
              const ref = realtimeDb.ref(
                user_id
              );
              ref
                .set(["obnne"]
                )
                .then(() => {
                  return res.status(201).send({ user_id: user_id });
                })
            });
        });
    })
    .catch((error) => {
      const { code, message } = error;
      // Delete any info that was created in Neo4j and Firestore if an error occurs
      console.log("Error adding user. Deleting user.");

      
      try {
        // Delete user from firebase auth if created
        admin.auth().deleteUser(user_id);
      } catch (error) {
        console.log("Error deleting user from firebase auth", error);
      }

      try {
        // Delete user in firestore if created
        db.collection("users").doc(user_id).delete();
      } catch (error) {
        console.log("Error deleting user from firestore", error);
      }

      try {
        // Delete user in Neo4j if created
        session.run("MATCH (u:User {user_id: $user_id}) DELETE u", { user_id });
      } catch (error) {
        console.log("Error deleting user from Neo4j", error);
      }

      // Handle error
      return res.status(code).send({ error: message });
    });
    
});
// -------------------------------------------------------

// Delete a user by ID
app.delete("/user/:userId", apiKeyMiddleware, (req, res) => {

  const { userId } = req.params;

  // Delete user from Neo4j database
  session
    .run("MATCH (u:User {user_id: $id}) DELETE u", { id: userId })
    .then(() => {
      // Delete user from firestore database
      db.collection("users")
        .doc(userId)
        .delete()
        .then(() => {
          // Delete tasks collection from firestore
          const collectionName = `tasks-${userId}`;
          db.collection(collectionName)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                doc.ref.delete();
              });
            })
            .then(() => {
              // Delete from realtime database
              const ref = realtimeDb.ref(userId);
              return ref.remove();
            })
            .then(() => {
              return res.status(204).send({ message: "User deleted" });
            });
        }) 
    })
    .catch((error) => {
      // Handle error
      const { code, message } = error;
      res.status(code).send({ error: message });
    });
});

// -------------------------------------------------------

// Get user by ID
app.get(
  "/user/:userId",
  apiKeyMiddleware,
  param("userId")
    .isString()
    .withMessage("Invalid user ID. Must be a string.")
    .not()
    .isEmpty()
    .withMessage("User ID cannot be empty."),
  (req, res) => {
    const { userId } = req.params;

    // Get user doc from firestore
    db.collection("users")
      .doc(userId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).send({ message: "User not found" });
        }
        const userData = doc.data();
        return res.status(200).send(userData);
      })
      .catch((error) => {
        // Handle error
        const { code, message } = error;
        return res.status(code).send({ error: message });
      });
  }
);
// -------------------------------------------------------

// Get friends of a user
app.get("/friends/:userId",
  apiKeyMiddleware,
  param("userId")
    .isString()
    .withMessage("Invalid user ID. Must be a string.")
    .not()
    .isEmpty()
    .withMessage("User ID cannot be empty."), (req, res) => {
  const { userId } = req.params;

  // Get friends from Neo4j database
  session
    .run(
      `MATCH (u:User {user_id: $userId})
     RETURN u AS user
     UNION ALL
     MATCH (u:User {user_id: $userId})-[:FRIEND]->(f:User)
     RETURN f AS user`,
      { userId }
    )
    .then((result) => {
      const friends = result.records.map(
        (record) => record.get("user").properties
      );
      return res.status(200).send(friends);
    })
    .catch((error) => {
      // Handle error
      const { code, message } = error;
      return res.status(code).send({ error: message });
    });
});
// -------------------------------------------------------

// Send friend request
app.post("/send-friend-request", apiKeyMiddleware, (req, res) => {
  const {userId, friendId} = req.body;

  // add friend request to firebase realtime database
  const ref = realtimeDb.ref(
    friendId
  );
  ref.once(
    "value",
    (snapshot) => {
      const requests = snapshot.val() || []; // Use existing list, or initialize an empty array if null
      if (!requests.includes(userId)) {
        // Check if userId is not already in the list to avoid duplicates
        requests.push(userId); // Add the new userId to the list
        // Update the reference with the new list
        ref
          .set(requests)
          .then(() => res.status(201).send({ message: "Friend request sent" }))
          .catch((error) =>
            res
              .status(500)
              .send({
                message: "Error sending friend request",
                error: error.message,
              })
          );
      } else {
        // Handle case where the friend request already exists
        res.status(409).send({ message: "Friend request already sent" });
      }
    },
    (error) => {
      res
        .status(500)
        .send({
          message: "Error retrieving friend requests",
          error: error.message,
        });
    }
  );
  // ref
  //   .set([userId])
  //   .then(() => {
  //     return res.status(201).send({ message: "Friend request sent" });
  //   });
});
// -------------------------------------------------------

// Add a friend
app.post("/add-friend", (req, res) => {
  const {userId, friendId} = req.body;

  // Modify Neo4j database
  session
    .run(
      "MATCH (u:User {user_id: $userId}), (f:User {user_id: $friendId}) CREATE (u)-[:FRIEND]->(f)",
      { userId, friendId }
    )
    .then(() => {
      return res.status(201).send({ message: "Friend added"});
    });
});
// -------------------------------------------------------

// Search for a user
app.get("/search-friend/:userName", apiKeyMiddleware, (req, res) => {
  const {userName} = req.params;

  // Search for user in Neo4j database
  session
    .run("MATCH (u:User) WHERE u.name CONTAINS $userName RETURN u", { userName })
    .then((result) => {
      const users = result.records.map((record) => record.get("u").properties);
      if (users.length === 0) {
        return res.status(404).send({ message: "No users found" });
      }
      return res.status(200).send(users);
    })
    .catch((error) => {
      // Handle error
      const { code, message } = error;
      return res.status(500).send({ error: message });
    });
});
// -------------------------------------------------------

// Add a new task
app.post("/new-task", apiKeyMiddleware, taskValidator, (req, res) => {
  console.log("New task request received");
  // Check for validation errors
  const errors = validationResult(req);

  // Return validation errors if any
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const {
    title,
    description,
    details,
    status,
    due_date,
    priority,
    user_id,
  } = req.body;

  // Extract task data from request body
  const task = {
    title,
    description,
    details,
    status,
    due_date,
    priority,
    user_id,
  };

  // Generate a new document reference with an auto-generated ID
  const docRef = db.collection(`tasks-${user_id}`).doc();
  // Add task to firestore database
  docRef
    .set(task)
    .then(() => {
      // Now you can use docRef.id to get the document ID
      return res.status(201).send({ task: task.title, docId: docRef.id });
    })
    .catch((error) => {
      // Handle error
      const { code, message } = error;
      return res.status(code).send({ error: message });
    });
});
// -------------------------------------------------------

// Get tasks of a user
app.get(
  "/tasks/:userId",
  apiKeyMiddleware,
  param("userId")
    .isString()
    .withMessage("Invalid user ID. Must be a string.")
    .not()
    .isEmpty()
    .withMessage("User ID cannot be empty."),
  (req, res) => {
    const { userId } = req.params;

    // Get tasks from firestore database by user id
    db.collection(`tasks-${userId}`)
      .orderBy("due_date")
      .get()
      .then((snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
          tasks.push({
            id: doc.id, // Include the document ID
            ...doc.data(), // Spread the rest of the task data
          });
        });
        return res.status(200).send(tasks);
      })
      .catch((error) => {
        // Handle error
        const { code, message } = error;
        return res.status(code).send({ error: message });
      });
  }
);
// -------------------------------------------------------

// Get task by ID
app.get(
  "/task/:userId/:taskId",
  apiKeyMiddleware,
  param("userId")
    .isString()
    .withMessage("Invalid user ID. Must be a string.")
    .not()
    .isEmpty()
    .withMessage("User ID cannot be empty."),
  param("taskId")
    .isString()
    .withMessage("Invalid task ID. Must be a string.")
    .not()
    .isEmpty()
    .withMessage("Task ID cannot be empty."),
  (req, res) => {
    const { userId, taskId } = req.params;

    // Get task from firestore database by task id
    db.collection(`tasks-${userId}`)
      .doc(taskId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).send({ message: "Task not found" });
        }
        const task = doc.data();
        return res.status(200).send(task);
      })
      .catch((error) => {
        // Handle error
        const { code, message } = error;
        return res.status(code).send({ error: message });
      });
  }
);
// -------------------------------------------------------

// Update task
app.put("/task/:userId/:taskId",apiKeyMiddleware, taskValidator, (req, res) => {
  const { taskId, userId } = req.params;
  // Check for validation errors
  const errors = validationResult(req);

  

  // Update task in firestore database by task id
  db.collection(`tasks-${userId}`)
    .doc(taskId)
    .update(req.body)
    .then(() => {
      return res.status(200).send({ message: `Task ${taskId} updated.` });
    })
    .catch((error) => {
      // Handle error
      console.log("Error updating task", error)
      const { code, message } = error;
      return res.status(code).send({ error: message });
    });
});
// -------------------------------------------------------

// Delete task
app.delete(
  "/task/:userId/:taskId",
  apiKeyMiddleware,
  (req, res) => {
    const { userId, taskId } = req.params;

    // Delete task from firestore database by task id
    db.collection(`tasks-${userId}`)
      .doc(taskId)
      .delete()
      .then(() => {
        return res.status(204).send({ message: `Task ${taskId} deleted`});
      })
      .catch((error) => {
        // Handle error
        const { code, message } = error;
        return res.status(code).send({ error: message });
      });
  }
);
// -------------------------------------------------------

// exports.app = onRequest(app);


// Comment out before deploying to firebase
// for local testing only
// -----------------------------------------
const port = 3000;
app.listen(port, () => {
  console.log(`Social Tasker Backend listening on port ${port}`);
});
