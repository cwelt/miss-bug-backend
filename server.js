import express from "express";
const app = express();
const PORT = 3030;

app.get("/api/bug", async (req, res) => {
  res.status(200).send({ msg: "Hello from Miss Bug Backend!" });
});
app.get("/api/bug/save", async (req, res) => {});
app.get("/api/bug/:bugId", async (req, res) => {});
app.get("/api/bug/:bugId/remove", async (req, res) => {});

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
