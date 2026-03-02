import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { closePool, query } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
  const schemaPath = path.join(__dirname, "sql", "schema.sql");
  const sql = await fs.readFile(schemaPath, "utf8");
  await query(sql);
  console.log("Migrations completed.");
};

run()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
