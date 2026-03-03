import crypto from "crypto";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import multer from "multer";
import { z } from "zod";
import { query, withTransaction } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const uploadRoot = process.env.UPLOAD_DIR
  ? path.resolve(rootDir, process.env.UPLOAD_DIR)
  : path.join(rootDir, "public", "uploads");
fs.mkdirSync(uploadRoot, { recursive: true });

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3000);
const sessionSecret = process.env.SESSION_SECRET || "replace-this-session-secret";
const sessionCookieName = process.env.SESSION_COOKIE_NAME || "ve_session";
const sessionDays = Number(process.env.SESSION_DAYS || 14);
const maxUploadBytes = Number(process.env.MAX_UPLOAD_BYTES || 15 * 1024 * 1024);

app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadRoot));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(6),
});

const siteSettingsSchema = z.object({
  settings: z.record(z.any()),
});

const sectionInputSchema = z.object({
  sectionKey: z.string().min(1).max(120),
  sortOrder: z.number().int().optional(),
  data: z.record(z.any()).or(z.array(z.any())).or(z.string()).or(z.number()).or(z.boolean()).or(z.null()),
});

const pageUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(["draft", "published"]).optional(),
  seo: z.record(z.any()).optional(),
  sections: z.array(sectionInputSchema).optional(),
});

const postWriteSchema = z.object({
  title: z.string().min(1).max(220),
  slug: z.string().min(1).max(220).optional(),
  excerpt: z.string().max(2000).optional(),
  contentJson: z.record(z.any()).or(z.array(z.any())).optional(),
  featuredImageUrl: z.string().max(1024).optional().nullable(),
  status: z.enum(["draft", "published"]).optional(),
  publishAt: z.string().datetime().optional().nullable(),
  seo: z.record(z.any()).optional(),
  categories: z.array(z.string().min(1).max(80)).optional(),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).max(120),
});

const hashToken = (token) => crypto.createHmac("sha256", sessionSecret).update(token).digest("hex");
const randomToken = () => crypto.randomBytes(32).toString("hex");

const clearSessionCookie = (res) => {
  res.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });
};

const setSessionCookie = (res, token, expiresAt) => {
  res.cookie(sessionCookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
};

const toSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "untitled";

const serializeAdmin = (row) => ({
  id: row.id,
  email: row.email,
  displayName: row.display_name,
});

const getAuthFromCookie = async (req) => {
  const rawToken = req.cookies?.[sessionCookieName];
  if (!rawToken) {
    return null;
  }
  const tokenHash = hashToken(rawToken);
  const result = await query(
    `SELECT s.id AS session_id, s.csrf_token, s.expires_at, a.id, a.email, a.display_name
     FROM sessions s
     JOIN admins a ON a.id = s.admin_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return {
    rawToken,
    tokenHash,
    sessionId: result.rows[0].session_id,
    csrfToken: result.rows[0].csrf_token,
    admin: serializeAdmin(result.rows[0]),
  };
};

const optionalAuth = async (req, _res, next) => {
  try {
    req.auth = await getAuthFromCookie(req);
    next();
  } catch (error) {
    next(error);
  }
};

const requireAuth = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Authentication required." });
  }
  return next();
};

const requireCsrf = (req, res, next) => {
  const csrf = req.get("x-csrf-token");
  if (!csrf || !req.auth || csrf !== req.auth.csrfToken) {
    return res.status(403).json({ error: "Invalid CSRF token." });
  }
  return next();
};

const fetchPageBySlug = async (slug, includeDraft = false) => {
  const pageResult = await query("SELECT * FROM pages WHERE slug = $1 LIMIT 1", [slug]);
  if (pageResult.rowCount === 0) {
    return null;
  }

  const page = pageResult.rows[0];
  if (!includeDraft && page.status !== "published") {
    return null;
  }

  const sections = await query(
    `SELECT id, section_key, section_data_json, sort_order, created_at, updated_at
     FROM page_sections
     WHERE page_id = $1
     ORDER BY sort_order ASC, id ASC`,
    [page.id],
  );

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: page.status,
    seo: page.seo_json || {},
    createdAt: page.created_at,
    updatedAt: page.updated_at,
    sections: sections.rows.map((section) => ({
      id: section.id,
      sectionKey: section.section_key,
      sortOrder: section.sort_order,
      data: section.section_data_json || {},
      createdAt: section.created_at,
      updatedAt: section.updated_at,
    })),
  };
};

const fetchSiteSettings = async () => {
  const result = await query(
    "SELECT settings_json, updated_at FROM site_settings WHERE settings_key = 'global' LIMIT 1",
  );
  if (result.rowCount === 0) {
    return { settings: {}, updatedAt: null };
  }
  return {
    settings: result.rows[0].settings_json || {},
    updatedAt: result.rows[0].updated_at,
  };
};

const ensureCategories = async (client, names = []) => {
  const categoryIds = [];
  for (const nameValue of names) {
    const cleanName = nameValue.trim();
    if (!cleanName) {
      continue;
    }
    const slug = toSlug(cleanName);
    const upserted = await client.query(
      `INSERT INTO categories (name, slug)
       VALUES ($1, $2)
       ON CONFLICT (slug)
       DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [cleanName, slug],
    );
    categoryIds.push(upserted.rows[0].id);
  }
  return categoryIds;
};

const syncPostCategories = async (client, postId, categories) => {
  if (!Array.isArray(categories)) {
    return;
  }
  await client.query("DELETE FROM post_categories WHERE post_id = $1", [postId]);
  const categoryIds = await ensureCategories(client, categories);
  for (const categoryId of categoryIds) {
    await client.query(
      "INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [postId, categoryId],
    );
  }
};

const hydratePost = async (row) => {
  const categories = await query(
    `SELECT c.id, c.name, c.slug
     FROM categories c
     JOIN post_categories pc ON pc.category_id = c.id
     WHERE pc.post_id = $1
     ORDER BY c.name ASC`,
    [row.id],
  );

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    contentJson: row.content_json || { version: 1, blocks: [] },
    featuredImageUrl: row.featured_image_url,
    status: row.status,
    publishAt: row.publish_at,
    seo: row.seo_json || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    categories: categories.rows,
  };
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const now = new Date();
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dir = path.join(uploadRoot, year, month);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const unique = `${Date.now()}-${crypto.randomUUID()}`;
    cb(null, `${base || "upload"}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxUploadBytes },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
      "video/quicktime",
      "application/pdf",
    ]);
    cb(null, allowed.has(file.mimetype));
  },
});

const api = express.Router();
api.use(optionalAuth);

api.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

api.post("/auth/login", loginLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body || {});
    const adminResult = await query("SELECT * FROM admins WHERE email = $1 LIMIT 1", [parsed.email]);

    if (adminResult.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const admin = adminResult.rows[0];
    const passwordOk = await bcrypt.compare(parsed.password, admin.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    await query("DELETE FROM sessions WHERE expires_at <= NOW()");

    const rawToken = randomToken();
    const tokenHash = hashToken(rawToken);
    const csrfToken = randomToken();
    const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

    await query(
      `INSERT INTO sessions (admin_id, token_hash, csrf_token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [admin.id, tokenHash, csrfToken, expiresAt.toISOString()],
    );

    setSessionCookie(res, rawToken, expiresAt);

    return res.json({
      authenticated: true,
      admin: serializeAdmin(admin),
      csrfToken,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    return next(error);
  }
});

api.post("/auth/logout", async (req, res, next) => {
  try {
    const rawToken = req.cookies?.[sessionCookieName];
    if (rawToken) {
      await query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(rawToken)]);
    }
    clearSessionCookie(res);
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

api.get("/auth/me", async (req, res) => {
  if (!req.auth) {
    return res.json({ authenticated: false });
  }
  return res.json({
    authenticated: true,
    admin: req.auth.admin,
    csrfToken: req.auth.csrfToken,
  });
});

api.post("/auth/password", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const parsed = passwordChangeSchema.parse(req.body || {});
    const current = await query("SELECT password_hash FROM admins WHERE id = $1", [req.auth.admin.id]);
    if (current.rowCount === 0) {
      return res.status(404).json({ error: "Admin account not found." });
    }
    const ok = await bcrypt.compare(parsed.currentPassword, current.rows[0].password_hash);
    if (!ok) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    const passwordHash = await bcrypt.hash(parsed.newPassword, 12);
    await query("UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2", [
      passwordHash,
      req.auth.admin.id,
    ]);

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

api.get("/site", async (req, res, next) => {
  try {
    const settings = await fetchSiteSettings();
    const whereSql = req.auth ? "" : "WHERE status = 'published'";
    const pageList = await query(
      `SELECT slug, title, status, updated_at FROM pages ${whereSql}
       ORDER BY CASE WHEN slug = 'home' THEN 0 ELSE 1 END, slug ASC`,
    );
    return res.json({
      siteSettings: settings.settings,
      settingsUpdatedAt: settings.updatedAt,
      pages: pageList.rows.map((row) => ({
        slug: row.slug,
        title: row.title,
        status: row.status,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

api.put("/site", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const parsed = siteSettingsSchema.parse(req.body || {});
    await query(
      `INSERT INTO site_settings (settings_key, settings_json, updated_by)
       VALUES ('global', $1::jsonb, $2)
       ON CONFLICT (settings_key)
       DO UPDATE SET settings_json = EXCLUDED.settings_json, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
      [JSON.stringify(parsed.settings), req.auth.admin.id],
    );
    return res.json({ ok: true, settings: parsed.settings });
  } catch (error) {
    return next(error);
  }
});

api.get("/pages/:slug", async (req, res, next) => {
  try {
    const page = await fetchPageBySlug(req.params.slug, Boolean(req.auth));
    if (!page) {
      return res.status(404).json({ error: "Page not found." });
    }
    return res.json(page);
  } catch (error) {
    return next(error);
  }
});

api.put("/pages/:slug", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const slug = toSlug(req.params.slug);
    const parsed = pageUpdateSchema.parse(req.body || {});

    const updated = await withTransaction(async (client) => {
      const existing = await client.query("SELECT * FROM pages WHERE slug = $1 LIMIT 1", [slug]);

      let pageId;
      let nextTitle = parsed.title || "Untitled Page";
      let nextStatus = parsed.status || "draft";
      let nextSeo = parsed.seo || {};

      if (existing.rowCount > 0) {
        const current = existing.rows[0];
        nextTitle = parsed.title || current.title;
        nextStatus = parsed.status || current.status;
        nextSeo = parsed.seo || current.seo_json || {};
        const updateResult = await client.query(
          `UPDATE pages
           SET title = $1, status = $2, seo_json = $3::jsonb, updated_at = NOW()
           WHERE id = $4
           RETURNING id`,
          [nextTitle, nextStatus, JSON.stringify(nextSeo), current.id],
        );
        pageId = updateResult.rows[0].id;
      } else {
        const insertResult = await client.query(
          `INSERT INTO pages (slug, title, status, seo_json)
           VALUES ($1, $2, $3, $4::jsonb)
           RETURNING id`,
          [slug, nextTitle, nextStatus, JSON.stringify(nextSeo)],
        );
        pageId = insertResult.rows[0].id;
      }

      if (Array.isArray(parsed.sections)) {
        await client.query("DELETE FROM page_sections WHERE page_id = $1", [pageId]);
        for (let i = 0; i < parsed.sections.length; i += 1) {
          const section = parsed.sections[i];
          await client.query(
            `INSERT INTO page_sections (page_id, section_key, section_data_json, sort_order)
             VALUES ($1, $2, $3::jsonb, $4)`,
            [pageId, section.sectionKey, JSON.stringify(section.data), section.sortOrder ?? i],
          );
        }
      }

      return fetchPageBySlug(slug, true);
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

api.get("/posts", async (req, res, next) => {
  try {
    const limit = Math.max(1, Math.min(100, Number(req.query.limit || 50)));
    const offset = Math.max(0, Number(req.query.offset || 0));
    const search = String(req.query.search || "").trim();
    const allowDraft = Boolean(req.auth);

    const params = [];
    const whereClauses = [];

    if (!allowDraft) {
      whereClauses.push("status = 'published'");
    } else if (req.query.status) {
      params.push(String(req.query.status));
      whereClauses.push(`status = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      whereClauses.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    params.push(limit, offset);
    const limitRef = `$${params.length - 1}`;
    const offsetRef = `$${params.length}`;

    const posts = await query(
      `SELECT * FROM posts
       ${whereSql}
       ORDER BY COALESCE(publish_at, created_at) DESC, id DESC
       LIMIT ${limitRef}
       OFFSET ${offsetRef}`,
      params,
    );

    const hydrated = [];
    for (const row of posts.rows) {
      hydrated.push(await hydratePost(row));
    }

    return res.json({ items: hydrated, limit, offset });
  } catch (error) {
    return next(error);
  }
});

api.get("/posts/:slug", async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const params = [slug];
    let sql = "SELECT * FROM posts WHERE slug = $1";
    if (!req.auth) {
      sql += " AND status = 'published'";
    }
    sql += " LIMIT 1";
    const result = await query(sql, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    return res.json(await hydratePost(result.rows[0]));
  } catch (error) {
    return next(error);
  }
});

api.post("/posts", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const parsed = postWriteSchema.parse(req.body || {});
    const slug = toSlug(parsed.slug || parsed.title);
    const publishAt = parsed.publishAt ? new Date(parsed.publishAt) : null;
    if (publishAt && Number.isNaN(publishAt.getTime())) {
      return res.status(400).json({ error: "Invalid publishAt value." });
    }

    const created = await withTransaction(async (client) => {
      const insert = await client.query(
        `INSERT INTO posts
         (title, slug, excerpt, content_json, featured_image_url, status, publish_at, seo_json, created_by, updated_by)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8::jsonb, $9, $9)
         RETURNING *`,
        [
          parsed.title,
          slug,
          parsed.excerpt || "",
          JSON.stringify(parsed.contentJson || { version: 1, blocks: [] }),
          parsed.featuredImageUrl || null,
          parsed.status || "draft",
          publishAt ? publishAt.toISOString() : null,
          JSON.stringify(parsed.seo || {}),
          req.auth.admin.id,
        ],
      );
      await syncPostCategories(client, insert.rows[0].id, parsed.categories);
      return hydratePost(insert.rows[0]);
    });

    return res.status(201).json(created);
  } catch (error) {
    if (String(error.message || "").includes("duplicate key value")) {
      return res.status(409).json({ error: "Post slug already exists." });
    }
    return next(error);
  }
});

api.put("/posts/:id", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ error: "Invalid post id." });
    }

    const parsed = postWriteSchema.partial().parse(req.body || {});

    const updated = await withTransaction(async (client) => {
      const existing = await client.query("SELECT * FROM posts WHERE id = $1 LIMIT 1", [postId]);
      if (existing.rowCount === 0) {
        return null;
      }
      const current = existing.rows[0];

      const nextTitle = parsed.title || current.title;
      const nextSlug = parsed.slug ? toSlug(parsed.slug) : current.slug;
      const nextExcerpt = parsed.excerpt ?? current.excerpt;
      const nextContent = parsed.contentJson ?? current.content_json ?? { version: 1, blocks: [] };
      const nextFeaturedImageUrl = parsed.featuredImageUrl ?? current.featured_image_url;
      const nextStatus = parsed.status || current.status;
      const nextPublishAt = parsed.publishAt
        ? new Date(parsed.publishAt).toISOString()
        : parsed.publishAt === null
          ? null
          : current.publish_at;
      const nextSeo = parsed.seo ?? current.seo_json ?? {};

      const result = await client.query(
        `UPDATE posts
         SET title = $1,
             slug = $2,
             excerpt = $3,
             content_json = $4::jsonb,
             featured_image_url = $5,
             status = $6,
             publish_at = $7,
             seo_json = $8::jsonb,
             updated_by = $9,
             updated_at = NOW()
         WHERE id = $10
         RETURNING *`,
        [
          nextTitle,
          nextSlug,
          nextExcerpt,
          JSON.stringify(nextContent),
          nextFeaturedImageUrl,
          nextStatus,
          nextPublishAt,
          JSON.stringify(nextSeo),
          req.auth.admin.id,
          postId,
        ],
      );

      await syncPostCategories(client, postId, parsed.categories);
      return hydratePost(result.rows[0]);
    });

    if (!updated) {
      return res.status(404).json({ error: "Post not found." });
    }

    return res.json(updated);
  } catch (error) {
    if (String(error.message || "").includes("duplicate key value")) {
      return res.status(409).json({ error: "Post slug already exists." });
    }
    return next(error);
  }
});

api.delete("/posts/:id", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json({ error: "Invalid post id." });
    }
    const deleted = await query("DELETE FROM posts WHERE id = $1 RETURNING id", [postId]);
    if (deleted.rowCount === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

api.post("/uploads", requireAuth, requireCsrf, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing upload file." });
    }
    const relativePath = path.relative(uploadRoot, req.file.path).split(path.sep).join("/");
    const publicPath = `/uploads/${relativePath}`;

    const inserted = await query(
      `INSERT INTO media (filename, original_name, path, mime_type, size_bytes, alt_text, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.file.filename,
        req.file.originalname,
        publicPath,
        req.file.mimetype,
        req.file.size,
        req.body?.altText || "",
        req.auth.admin.id,
      ],
    );
    return res.status(201).json(inserted.rows[0]);
  } catch (error) {
    return next(error);
  }
});

api.get("/media/public", async (req, res, next) => {
  try {
    const limit = Math.max(1, Math.min(300, Number(req.query.limit || 180)));
    const result = await query(
      `SELECT id, filename, original_name, path, mime_type, size_bytes, alt_text, created_at
       FROM media
       WHERE mime_type LIKE 'image/%' AND mime_type <> 'image/svg+xml'
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit],
    );
    return res.json({ items: result.rows, limit });
  } catch (error) {
    return next(error);
  }
});

api.get("/media", requireAuth, async (_req, res, next) => {
  try {
    const result = await query("SELECT * FROM media ORDER BY created_at DESC");
    return res.json({ items: result.rows });
  } catch (error) {
    return next(error);
  }
});

api.delete("/media/:id", requireAuth, requireCsrf, async (req, res, next) => {
  try {
    const mediaId = Number(req.params.id);
    if (!Number.isInteger(mediaId) || mediaId <= 0) {
      return res.status(400).json({ error: "Invalid media id." });
    }
    const deleted = await query("DELETE FROM media WHERE id = $1 RETURNING *", [mediaId]);
    if (deleted.rowCount === 0) {
      return res.status(404).json({ error: "Media not found." });
    }

    const media = deleted.rows[0];
    if (typeof media.path === "string" && media.path.startsWith("/uploads/")) {
      const absolutePath = path.join(uploadRoot, media.path.replace(/^\/uploads\//, ""));
      await fsp.unlink(absolutePath).catch(() => undefined);
    }
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.use("/api", api);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API route not found." });
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

app.get(/^\/(?!api|uploads).*/, (req, res) => {
  const indexPath = path.join(distDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    return res.status(503).send("Frontend build not found. Run `npm run build` first.");
  }
  return res.sendFile(indexPath);
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: `File too large. Max ${maxUploadBytes} bytes.` });
    }
    return res.status(400).json({ error: error.message });
  }
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: "Validation failed.",
      details: error.flatten(),
    });
  }
  console.error(error);
  return res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
