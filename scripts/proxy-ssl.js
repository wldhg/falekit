const path = require("path");
const fs = require("fs");
const proxy = require("http-proxy");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

if (!process.env.SSL_CERT_PATH) {
  throw new Error("SSL_CERT_PATH is not defined");
} else if (!path.isAbsolute(process.env.SSL_CERT_PATH)) {
  process.env.SSL_CERT_PATH = path.join(process.cwd(), process.env.SSL_CERT_PATH);
}

if (!process.env.SSL_KEY_PATH) {
  throw new Error("SSL_KEY_PATH is not defined");
} else if (!path.isAbsolute(process.env.SSL_KEY_PATH)) {
  process.env.SSL_KEY_PATH = path.join(process.cwd(), process.env.SSL_KEY_PATH);
}

let host = "localhost";
if (process.env.SSL_HOST) {
  host = process.env.SSL_HOST;
}

console.log(`Proxying below to https://${host}:3000`);

proxy
  .createServer({
    xfwd: true,
    ws: true,
    target: {
      host: "localhost",
      port: 3001,
    },
    ssl: {
      key: fs.readFileSync(process.env.SSL_KEY_PATH, "utf8"),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH, "utf8"),
    },
  })
  .on("error", function (e) {
    console.error(`Request failed to proxy: ${e.code}`);
  })
  .listen(3000, host);
