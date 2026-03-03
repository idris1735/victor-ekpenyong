const path = require("path");
const { pathToFileURL } = require("url");

process.chdir(__dirname);

const entry = pathToFileURL(path.join(__dirname, "server", "index.js")).href;
import(entry).catch((error) => {
  console.error("Passenger failed to start app:", error);
  process.exit(1);
});
