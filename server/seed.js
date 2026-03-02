import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { defaultHomeSections, defaultSiteSettings } from "./contentDefaults.js";
import { closePool, query, withTransaction } from "./db.js";

dotenv.config();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";
const ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME || "Site Admin";

const ensureAdmin = async () => {
  const existing = await query("SELECT id FROM admins WHERE email = $1", [ADMIN_EMAIL]);
  if (existing.rowCount > 0) {
    return existing.rows[0].id;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const inserted = await query(
    `INSERT INTO admins (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [ADMIN_EMAIL, passwordHash, ADMIN_DISPLAY_NAME],
  );
  return inserted.rows[0].id;
};

const upsertSiteSettings = async (adminId) => {
  await query(
    `INSERT INTO site_settings (settings_key, settings_json, updated_by)
     VALUES ('global', $1::jsonb, $2)
     ON CONFLICT (settings_key)
     DO UPDATE SET settings_json = EXCLUDED.settings_json, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
    [JSON.stringify(defaultSiteSettings), adminId],
  );
};

const upsertHomePage = async (adminId) => {
  await withTransaction(async (client) => {
    const pageResult = await client.query(
      `INSERT INTO pages (slug, title, status, seo_json)
       VALUES ('home', 'Home', 'published', '{}'::jsonb)
       ON CONFLICT (slug)
       DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status, updated_at = NOW()
       RETURNING id`,
    );

    const pageId = pageResult.rows[0].id;
    const sectionEntries = Object.entries(defaultHomeSections);

    for (let i = 0; i < sectionEntries.length; i += 1) {
      const [sectionKey, sectionData] = sectionEntries[i];
      await client.query(
        `INSERT INTO page_sections (page_id, section_key, section_data_json, sort_order)
         VALUES ($1, $2, $3::jsonb, $4)
         ON CONFLICT (page_id, section_key)
         DO UPDATE
         SET section_data_json = EXCLUDED.section_data_json,
             sort_order = EXCLUDED.sort_order,
             updated_at = NOW()`,
        [pageId, sectionKey, JSON.stringify(sectionData), i],
      );
    }

    const defaultCategory = "insights";
    await client.query(
      `INSERT INTO categories (name, slug)
       VALUES ('Insights', $1)
       ON CONFLICT (slug) DO NOTHING`,
      [defaultCategory],
    );

    const existingPost = await client.query("SELECT id FROM posts WHERE slug = 'welcome'");
    if (existingPost.rowCount === 0) {
      const createdPost = await client.query(
        `INSERT INTO posts (title, slug, excerpt, content_json, status, publish_at, created_by, updated_by)
         VALUES ($1, $2, $3, $4::jsonb, 'published', NOW(), $5, $5)
         RETURNING id`,
        [
          "Welcome to the Official Portfolio",
          "welcome",
          "This site is now powered by a PostgreSQL-backed CMS.",
          JSON.stringify({
            version: 1,
            blocks: [
              { type: "heading", level: 2, text: "Welcome" },
              {
                type: "paragraph",
                text: "This is the first CMS-powered blog post. You can edit this from /backend.",
              },
            ],
          }),
          adminId,
        ],
      );

      const category = await client.query("SELECT id FROM categories WHERE slug = $1", [defaultCategory]);
      if (category.rowCount > 0) {
        await client.query(
          "INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [createdPost.rows[0].id, category.rows[0].id],
        );
      }
    }
  });
};

const run = async () => {
  const adminId = await ensureAdmin();
  await upsertSiteSettings(adminId);
  await upsertHomePage(adminId);

  console.log("Seed completed.");
  console.log(`Admin email: ${ADMIN_EMAIL}`);
  console.log(
    "If this is a fresh setup, use ADMIN_PASSWORD from environment or default 'ChangeMe123!' and rotate immediately.",
  );
};

run()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
