const path = require("path");
const fs = require("fs");
const proxy = require("http-proxy");

const SSL_KEY_PATH = path.join(__dirname, "../assets/localhost.key");
const SSL_CERT_PATH = path.join(__dirname, "../assets/localhost.crt");

console.log(`Proxying below to https://0.0.0.0:3000`);

proxy
  .createServer({
    xfwd: true,
    ws: true,
    target: {
      host: "localhost",
      port: 3001,
    },
    ssl: {
      key: fs.readFileSync(SSL_KEY_PATH, "utf8"),
      cert: fs.readFileSync(SSL_CERT_PATH, "utf8"),
    },
  })
  .on("error", function (e) {
    console.error(`Request failed to proxy: ${e.code}`);
  })
  .listen(3000, "0.0.0.0");
