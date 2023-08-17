const path = require("path");
const fs = require("fs");
const os = require("os");
const proxy = require("http-proxy");

let SSL_KEY_PATH = path.join(__dirname, "../assets/custom.key");
if (!fs.existsSync(SSL_KEY_PATH))
  SSL_KEY_PATH = path.join(__dirname, "../assets/localhost.key");

let SSL_CERT_PATH = path.join(__dirname, "../assets/custom.crt");
if (!fs.existsSync(SSL_CERT_PATH))
  SSL_CERT_PATH = path.join(__dirname, "../assets/localhost.crt");

console.log(`Proxying below to https://0.0.0.0:3000`);

const PING_PATH = path.join(os.tmpdir(), "FALETEMP_ping.json");
if (fs.existsSync(PING_PATH)) {
  fs.unlinkSync(PING_PATH);
}

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
