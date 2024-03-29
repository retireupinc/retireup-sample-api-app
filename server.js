require("./env");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const axios = require("axios");
const { URLSearchParams } = require("url");
const jwt = require("jsonwebtoken");

const { SERVER_PORT, WEBSITE_URL, API_URL, API_SUB, API_KEY, API_SECRET } =
  process.env;

const app = express();

app.disable("x-powered-by");

// Serves static resources
app.use(express.static(path.join(__dirname, "build"), { index: "index.html" }));

// Proxy API requests
app.use(
  "/api",
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
  })
);

// Get access token for API requests
app.get("/token", (req, res, next) => {
  const sub = req.query?.sub || API_SUB;

  if (!API_KEY || !API_SECRET) {
    // Requests an access token for the demo app
    const params = new URLSearchParams();
    params.append("sub", sub);

    axios
      .post(`${API_URL}/api/demo/token`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      })
      .then(({ data }) => {
        res.json(data);
      })
      .catch((err) => next(err));
  } else {
    // Requests an access token using your apps credentials
    const jwtPayload = {
      iss: API_KEY,
      sub,
      aud: API_URL,
      exp: Math.floor(Date.now() / 1000) + 60 * 2,
      scope: [
        "plan.read",
        "plan.write",
        "household.read",
        "household.write",
      ].join(","),
    };

    const jwtAssertion = jwt.sign(jwtPayload, API_SECRET);

    const params = new URLSearchParams();
    params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    params.append("assertion", jwtAssertion);

    axios
      .post(`${API_URL}/api/token`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      })
      .then(({ data }) => {
        res.json(data);
      })
      .catch((err) => next(err));
  }
});

// Start the Proxy
app.listen(SERVER_PORT, () => {
  console.log(`Starting website at ${WEBSITE_URL}`);
});
