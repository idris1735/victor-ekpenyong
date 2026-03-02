import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { closePool, query } from "./db.js";

dotenv.config();

const emailArg = process.argv[2];
const passwordArg = process.argv[3];

const email = (emailArg || process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
const password = passwordArg || process.env.ADMIN_PASSWORD || "ChangeMe123!";
const displayName = process.env.ADMIN_DISPLAY_NAME || "Site Admin";

const run = async () => {
  const passwordHash = await bcrypt.hash(password, 12);

  await query(
    `INSERT INTO admins (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (email)
     DO UPDATE SET password_hash = EXCLUDED.password_hash, display_name = EXCLUDED.display_name, updated_at = NOW()`,
    [email, passwordHash, displayName],
  );

  console.log(`Admin account reset for ${email}`);
};

run()
  .catch((error) => {
    console.error("Reset admin failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
