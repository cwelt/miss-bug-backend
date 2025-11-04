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

app.use(cors(corsOptions));

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

//* Create/Update
app.get("/api/bug/save", async (req, res) => {
  // example request: http://localhost:3030/api/bug/save?_id=500qtl&title=foo&severity=5&createdAt=1761821492000&description=bar
  const bugToSave = {
    _id: req.query._id,
    title: req.query.title,
    description: req.query.description,
    severity: +req.query.severity,
    createdAt: +req.query.createdAt,
  };

  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
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
app.get("/api/bug/:bugId/remove", async (req, res) => {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.send(`Bug ${bugId} Removed successfully`);
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
