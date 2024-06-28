/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const bodyParser = require("body-parser");

// Initialize express server
const app = express();
// Adding middleware to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// API endpoints
// Create a new user
app.post("/new-user", (req, res) => {
  const {name, email} = req.body;

  // Add to firestore database

  // Then add to Neo4j database
  
  res.status(201).send({name, email});
});

// Get user by ID
app.get("/user/:id", (req, res) => {
  const {id} = req.params;

  // Get user doc from firestore


  res.status(200).send({id});
});

// Get firends of a user
app.get("/friends/:id", (req, res) => {
  const {id} = req.params;

  // Get friends from Neo4j database

 
  res.status(200).send({id});
});

// Add a friend
app.post("/add-friend", (req, res) => {
  const {userId, friendId} = req.body;

  // Modify Neo4j database

  res.status(201).send({userId, friendId});
});

// Add a new task
app.post("/new-task", (req, res) => {
  const {userId, task} = req.body;

  // Add task to firestore database

  res.status(201).send({userId, task});
});

// Get tasks of a user
app.get("/tasks/:userId", (req, res) => {
  const {userId} = req.params;

  // Get tasks from firestore database by user id


  res.status(200).send({id});
});

// Update task
app.put("/task/:taskId", (req, res) => {
  const { taskId } = req.params;
  const {task} = req.body;

  // Update task in firestore database by task id


  res.status(200).send({id, task});
});

// Delete task
app.delete("/task/:taskId", (req, res) => {
  const { taskId } = req.params;

  // Delete task from firestore database by task id


  res.status(204).send();
});

exports.app = onRequest(app);