const { google } = require("googleapis");
const { readFileSync } = require("fs");
const path = require("path");

const credentials = JSON.parse(
  readFileSync(path.join(__dirname, "./credentials.json"), "utf8")
);

const oauth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

// Set refresh token
oauth2Client.setCredentials({
  refresh_token: "f67d0b70987e75cb676cb0a807c1ff93f360fe90",
});

module.exports = oauth2Client;
