/* sets up an Express.js server with dynamic route loading */

import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { readdirSync } from "fs";

/* The server will listen on a port number.It first checks if there is a PORT environment variable 
(process.env.PORT). If no environment variable is set, it defaults to 8000. */
const port = process.env.PORT || 8000;

/* Middleware Setup: cors(). Enables CORS (Cross-Origin Resource Sharing), allowing API requests from different domains.
express.json(): Parses incoming JSON request bodies so that req.body contains JSON data. */
app.use(cors());
app.use(express.json());

/*Set Up File Paths. In ES Modules (.mjs or type: "module"), __dirname and __filename are not available by default.
This code manually constructs them: fileURLToPath(import.meta.url) gets the current file’s full path (__filename).
path.dirname(__filename) gets the directory name (__dirname). */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Dynamically Import and Use Route Files.  path.resolve(__dirname, "./routes") constructs the absolute path to the routes folder.
readdirSync(routesPath) reads all filenames inside the routes directory. The code loops over all route files and dynamically imports them.
Each route file is added to Express with app.use("/"), meaning all routes will be accessible under /. Why Use Dynamic Import?
Automatically loads all route files without needing to manually import each one. Makes the app more scalable, as new routes can be added easily.*/
const routesPath = path.resolve(__dirname, "./routes");
const routeFiles = readdirSync(routesPath);
routeFiles.map(async (file) => {
  const routeModule = await import(`./routes/${file}`);
  app.use("/", routeModule.default);
});

/* Serve an HTML File at /  When a GET request is made to /, it serves the index.html file from the public directory. */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* Start the Server: The Express server listens on the defined port. Logs a message when the server starts */
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});