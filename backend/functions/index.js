/**
 ---------- SOCIAL TASKER ----------
 ---------- API Endpoints ----------
 */

const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const { validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const { initializeApp } = require("firebase-admin/app");
const { userValidator, idValidator } = require("./validators");
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
    .add(userData)
    .then(() => {
      console.log("User added to Firestore database");
      // Add user to Neo4j database
      session
        .run("CREATE (u:User {user_id: $user_id}) RETURN u", {
          user_id: user_id,
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
app.delete("/user/:id", idValidator, (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);

  // Return validation errors if any
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { id } = req.params;

  // Delete user from Neo4j database
  session
    .run("MATCH (u:User {user_id: $id}) DELETE u", { id: id })
    .then(() => {
      // Delete user from firestore database
      db.collection("users")
        .doc(id)
        .delete()
        .then(() => {
          // Send response
          return res.status(204).send({ message: "User deleted" });
        })
        .then(() => {
          // Delete tasks collection from firestore
          const collectionName = `tasks-${id}`;
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
app.get("/user/:id", (req, res) => {
  const {id} = req.params;

  // Get user doc from firestore



  res.status(200).send({id});
});
// -------------------------------------------------------

// Get friends of a user
app.get("/friends/:id", (req, res) => {
  const {id} = req.params;

  // Get friends from Neo4j database

 
  res.status(200).send({id});
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
app.post("/new-task", (req, res) => {
  const {userId, task} = req.body;

  // Add task to firestore database

  res.status(201).send({userId, task});
});
// -------------------------------------------------------

// Get tasks of a user
app.get("/tasks/:userId", (req, res) => {
  const {userId} = req.params;

  // Get tasks from firestore database by user id


  res.status(200).send({id});
});
// -------------------------------------------------------

// Update task
app.put("/task/:taskId", (req, res) => {
  const { taskId } = req.params;
  const {task} = req.body;

  // Update task in firestore database by task id


  res.status(200).send({id, task});
});
// -------------------------------------------------------

// Delete task
app.delete("/task/:taskId", (req, res) => {
  const { taskId } = req.params;

  // Delete task from firestore database by task id


  res.status(204).send();
});
// -------------------------------------------------------

// exports.app = onRequest(app);


// Comment out before deploying to firebase
// for local testing only
// -----------------------------------------
const port = 3000;
app.listen(port, () => {
  console.log(`Social Tasker Backend listening on port ${port}`);
});
