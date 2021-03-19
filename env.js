const path = require("path");

require("dotenv-safe").config({
  path: path.join(process.cwd(), ".env"),
  example: path.join(process.cwd(), ".env.sample"),
  allowEmptyValues: true,
});

if (process.env.DEPLOYMENT_GROUP_NAME) {
  const [
    APPLICATION_NAME,
    STAGE_NAME,
  ] = process.env.DEPLOYMENT_GROUP_NAME.split("-");
  process.env.APPLICATION_NAME = APPLICATION_NAME;
  process.env.STAGE_NAME = STAGE_NAME;
}

process.env.APPLICATION_NAME = process.env.APPLICATION_NAME || "api-app";
process.env.STAGE_NAME = process.env.STAGE_NAME || "dev";
const { APPLICATION_NAME, STAGE_NAME } = process.env;
process.env.DEPLOYMENT_GROUP_NAME = `${APPLICATION_NAME}-${STAGE_NAME}-api-app`;

process.env.PROTOCOL =
  process.env.PROTOCOL || (STAGE_NAME === "dev" ? "http" : "https");
process.env.SUBDOMAIN =
  process.env.SUBDOMAIN ||
  `${APPLICATION_NAME}${STAGE_NAME === "prod" ? "" : `-${STAGE_NAME}`}`;
process.env.DOMAIN = process.env.DOMAIN || "retireup.com";
process.env.PORT =
  parseInt(process.env.SERVER_PORT || 80) +
  parseInt(process.env.NODE_APP_INSTANCE || 0);

const { PROTOCOL, SUBDOMAIN, DOMAIN, PORT } = process.env;
const port = STAGE_NAME === "dev" ? PORT : 80; // 80 here is a stand-in for the public port
process.env.WEBSITE_URL = `${PROTOCOL}://${SUBDOMAIN}.${DOMAIN}${
  port === 80 || (port === 443 && PROTOCOL === "https") ? "" : `:${port}`
}`;

// Setting a prop on env to undefined actually sets it as 'undefined'
Object.keys(process.env).forEach((key) => {
  if (process.env[key] === "undefined") {
    delete process.env[key];
  }
});
