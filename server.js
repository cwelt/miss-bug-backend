import express from "express";
import cors from "cors";
import { bugService } from "./api/bug/bug.service.js";
import { bugRoutes } from "./api/bug/bug.routes.js";

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
app.use("/api/bug", bugRoutes); // for bug routes

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
