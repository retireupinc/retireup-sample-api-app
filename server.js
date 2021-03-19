require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const jsonwebtoken = require("jsonwebtoken");

const { SERVER_PORT, API_URL, API_SUB, API_KEY, API_SECRET } = process.env;
const host = "localhost";
const port = Number(SERVER_PORT) || 5000;

const app = express();

// Server static resources
app.use(express.static(path.join(__dirname, "build")));

// Proxy API requests
app.use(
  "/api",
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
  })
);

// Server index.html production
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Get access token for API requests
app.get("/token", async (req, res, next) => {
  const jwtPayload = {
    iss: API_KEY,
    sub: API_SUB,
    aud: API_URL,
    exp: Math.floor(Date.now() / 1000) + 60 * 2,
    scope: [
      "plan.read",
      "plan.write",
      "household.read",
      "household.write",
    ].join(","),
  };

  const jwtAssertion = jsonwebtoken.sign(jwtPayload, API_SECRET);

  const params = new URLSearchParams();
  params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  params.append("assertion", jwtAssertion);

  const response = await fetch(`${API_URL}/api/token`, {
    body: params,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });

  const jwt = await response.json();
  res.json(jwt);
});

// Start the Proxy
app.listen(port, host, () => {
  console.log(`Starting Proxy at ${host}:${port}`);
});
