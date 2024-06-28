/**
 ---------- SOCIAL TASKER ----------
 ---------- API Endpoints ----------
 */

const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const { param, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const { initializeApp } = require("firebase-admin/app");
const { userValidator, idValidator, taskValidator } = require("./validators");
const neo4j = require("neo4j-driver");

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
});

// Initialize Neo4j driver
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session();

// Initialize Firestore database
const db = admin.firestore();


// Initialize express server
const app = express();
// Adding middleware to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// -------------------------------------------------------
// --------------   API endpoints ------------------------

// Create a new user
app.post("/new-user", userValidator, (req, res) => {
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
        .run("CREATE (u:User {user_id: $user_id, score: $score}) RETURN u", {
          user_id: user_id,
          score: 0,
        })
        .then(() => {
          // Create task collection for user in firestore
          const collectionName = `tasks-${user_id}`;
          db.collection(collectionName)
            .doc()
            .set({ title: "Sample task" })
            .then(() => {
              // Send response
              return res.status(201).send({ user_id: user_id });
            });
        });
    })
    .catch((error) => {
      const { code, message } = error;
      // Handle error
      return res.status(code).send({ error: message });
    });
    
});
// -------------------------------------------------------

// Delete a user by ID
app.delete("/user/:userId", idValidator, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  // Return validation errors if any
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
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
          // Send response
          return res.status(204).send({ message: "User deleted" });
        })
        .then(() => {
          // Delete tasks collection from firestore
          const collectionName = `tasks-${userId}`;
          db.collection(collectionName)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                doc.ref.delete();
              });
            });
        });
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
  param("userId")
    .isString()
    .withMessage("Invalid user ID. Must be a string.")
    .not()
    .isEmpty()
    .withMessage("User ID cannot be empty."), (req, res) => {
  const { userId } = req.params;

  // Get friends from Neo4j database

  res.status(200).send({ id });
});
// -------------------------------------------------------

// Add a friend
app.post("/add-friend", (req, res) => {
  const {userId, friendId} = req.body;

  // Modify Neo4j database

  res.status(201).send({userId, friendId});
});
// -------------------------------------------------------

// Add a new task
app.post("/new-task", taskValidator, (req, res) => {
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
      .get()
      .then((snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
          tasks.push(doc.data());
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

// Update task
app.put("/task/:taskId", taskValidator, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  // Return validation errors if any
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { taskId } = req.params;
  const {task} = req.body;

  // Update task in firestore database by task id
  db.collection(`tasks-${user_id}`)
    .doc(taskId)
    .update(task)
    .then(() => {
      return res.status(200).send({ message: `Task ${task.title} updated.` });
    })
    .catch((error) => {
      // Handle error
      const { code, message } = error;
      return res.status(code).send({ error: message });
    });
});
// -------------------------------------------------------

// Delete task
app.delete(
  "/task/:userId/:taskId",
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
