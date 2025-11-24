import express from "express";
import cors from "cors";

import { bugService } from "./services/bug.service.js";

//* ------------------- Config -------------------
const app = express();
const PORT = 3030;

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions)); // for cross origin allowance
app.use(express.json()); // for parsing application/json from frontend
app.use(express.static("public")); // to serve frontend files from the 'public' folder after build

//* ------------------- Bugs Crud -------------------
//* List
app.get("/api/bug", async (req, res) => {
  try {
    const bugs = await bugService.query();
    res.send(bugs);
  } catch (err) {
    console.error(`Couldn't get bugs`, err); //loggerService.error(`Couldn't get bugs`, err);
    res.status(400).send(`Couldn't get bugs`);
  }
});

//* Update
app.put("/api/bug/:bugId", async (req, res) => {
  const { bugId } = req.params;
  const { title, description, severity, labels } = req.body;
  const bugToSave = {
    _id: bugId,
    title,
    description,
    severity,
    labels: [...labels],
  };

  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    console.error(`Couldn't save bug ${bugToSave._id}`, err); // loggerService.error(`Couldn't save bug`, err);
    res.status(400).send(`Couldn't save bug with id: ${bugToSave._id}`);
  }
});

// * Create
app.post("/api/bug/", async (req, res) => {
  console.log(req.body);
  const { title, description, severity, createdAt, labels } = req.body;

  try {
    const bugToSave = {
      title,
      description,
      severity,
      createdAt,
      labels: [...labels],
    };
    const savedBug = await bugService.save(bugToSave);
    res.status(201).send(savedBug);
  } catch (err) {
    console.error(`Couldn't save bug ${bugToSave._id}`, err); // loggerService.error(`Couldn't save bug`, err);
    res.status(400).send(`Couldn't save bug with id: ${bugToSave._id}`);
  }
});

//* Read
app.get("/api/bug/:bugId", async (req, res) => {
  const { bugId } = req.params;
  try {
    const bug = await bugService.getById(bugId);
    res.send(bug);
  } catch (err) {
    console.error(`Couldn't get bug ${bugId}`, err); // loggerService.error(`Couldn't get bug ${bugId}`, err);
    res.status(400).send(`Couldn't get bug with id: ${bugId}`);
  }
});

//* Delete
app.delete("/api/bug/:bugId", async (req, res) => {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.status(204).send(`Bug ${bugId} Removed successfully`);
  } catch (err) {
    console.error(`Couldn't remove bug ${bugId}`, err); // loggerService.error(`Couldn't remove bug ${bugId}`, err);
    res.status(400).send(`Couldn't remove bug with id: ${bugId}`);
  }
});

// route for the root path
app.get("/", (req, res) => {
  const header = "<h1>Miss Bug Backend Service</h1>";
  const message = "<h2>This is the backend service for Miss Bug.</h2>";
  const requestHeadersTitle = "<h3>Request Headers:</h3>";
  const requestHeadersList = `<ul>${Object.entries(req.headers)
    .map(([key, value]) => `<li>${key}: ${value}</li>`)
    .join("")}</ul>`;

  const responseHeadersTitle = "<h3>Response Headers:</h3>";
  const responseHeadersList = `<ul>${Object.entries(res.getHeaders())
    .map(([key, value]) => `<li>${key}: ${value}</li>`)
    .join("")}</ul>`;

  res.send(
    header +
      message +
      `<p><strong>Request URL: </strong>${req.originalUrl}</p>` +
      `<p><strong>Method: </strong>${req.method}</p>` +
      `<p><strong>Protocol: </strong>${req.protocol}</p>` +
      requestHeadersTitle +
      requestHeadersList +
      responseHeadersTitle +
      responseHeadersList +
      `<h3>Response Status:</h3><p>${res.statusCode} ${res.statusMessage}</p>`
  );
});

// Start the server
app.listen(PORT, () => console.log(`Server ready at port ${PORT}`));
