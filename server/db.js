import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;
dotenv.config();

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const databaseUrl = process.env.DATABASE_URL;
const enableSsl = parseBoolean(process.env.DB_SSL, false);
const rejectUnauthorized = parseBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, false);

const sslConfig = enableSsl ? { rejectUnauthorized } : undefined;

const buildPoolConfig = () => {
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl);
      const username = decodeURIComponent(parsed.username || "");
      const password = decodeURIComponent(parsed.password || "");
      return {
        connectionString: databaseUrl,
        user: username || undefined,
        password: String(password),
        ssl: sslConfig,
      };
    } catch {
      return {
        connectionString: databaseUrl,
        ssl: sslConfig,
      };
    }
  }

  return {
    host: process.env.PGHOST || "127.0.0.1",
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || "postgres",
    user: process.env.PGUSER || "postgres",
    password: String(process.env.PGPASSWORD || ""),
    ssl: sslConfig,
  };
};

const pool = new Pool(buildPoolConfig());

export const query = (text, params = []) => pool.query(text, params);

export const withTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const closePool = async () => {
  await pool.end();
};
