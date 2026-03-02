import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { CmsPost, cmsApi } from "@/lib/cms";

type BackendView = "dashboard" | "pages" | "posts" | "media" | "settings" | "profile";

const navItems: Array<{ key: BackendView; label: string; path: string }> = [
  { key: "dashboard", label: "Dashboard", path: "/backend" },
  { key: "pages", label: "Pages", path: "/backend/pages" },
  { key: "posts", label: "Blog", path: "/backend/posts" },
  { key: "media", label: "Media", path: "/backend/media" },
  { key: "settings", label: "Settings", path: "/backend/settings" },
  { key: "profile", label: "Profile", path: "/backend/profile" },
];

const toView = (pathname: string): BackendView => {
  const segment = pathname.replace(/^\/backend\/?/, "").split("/")[0];
  switch (segment) {
    case "pages":
      return "pages";
    case "posts":
      return "posts";
    case "media":
      return "media";
    case "settings":
      return "settings";
    case "profile":
      return "profile";
    default:
      return "dashboard";
  }
};

const Hint = ({ text }: { text: string }) => (
  <span
    title={text}
    aria-label={text}
    className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-primary/40 text-[10px] text-primary"
  >
    i
  </span>
);

const DashboardView = () => {
  const siteQuery = useQuery({ queryKey: ["cms", "site"], queryFn: cmsApi.getSite });
  const postsQuery = useQuery({ queryKey: ["cms", "posts"], queryFn: cmsApi.getPosts });
  const mediaQuery = useQuery({ queryKey: ["cms", "media"], queryFn: cmsApi.getMedia });

  const cards = [
    { label: "Pages", value: String(siteQuery.data?.pages.length ?? 0) },
    { label: "Posts", value: String(postsQuery.data?.items.length ?? 0) },
    { label: "Media Files", value: String(mediaQuery.data?.items.length ?? 0) },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl">Dashboard</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-primary/20 bg-card/60 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">{card.label}</p>
            <p className="font-display text-4xl text-primary">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="border border-border bg-card/60 p-5">
        <p className="text-sm text-muted-foreground">
          Use the side menu to edit the homepage sections, upload media, and manage blog posts.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em]"
          >
            Open Public Blog
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em]"
          >
            Open Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

const PagesView = () => {
  const queryClient = useQueryClient();
  const pageQuery = useQuery({ queryKey: ["cms", "page", "home"], queryFn: () => cmsApi.getPage("home") });
  const mediaQuery = useQuery({ queryKey: ["cms", "media"], queryFn: cmsApi.getMedia });
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [sectionMap, setSectionMap] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedJson, setAdvancedJson] = useState("{}");
  const [selectedMediaPath, setSelectedMediaPath] = useState("");

  useEffect(() => {
    if (!pageQuery.data) return;
    const order = pageQuery.data.sections.map((section) => section.sectionKey);
    const map = pageQuery.data.sections.reduce<Record<string, unknown>>((acc, section) => {
      acc[section.sectionKey] = section.data || {};
      return acc;
    }, {});
    setSectionOrder(order);
    setSectionMap(map);
    setAdvancedJson(JSON.stringify(map, null, 2));
  }, [pageQuery.data]);

  const asObj = (value: unknown) =>
    value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

  const getSection = (key: string) => asObj(sectionMap[key]);

  const setField = (sectionKey: string, field: string, value: unknown) => {
    setSectionOrder((current) => (current.includes(sectionKey) ? current : [...current, sectionKey]));
    setSectionMap((current) => {
      const section = asObj(current[sectionKey]);
      return {
        ...current,
        [sectionKey]: {
          ...section,
          [field]: value,
        },
      };
    });
  };

  const getString = (sectionKey: string, field: string) => String(getSection(sectionKey)[field] || "");
  const getStringList = (sectionKey: string, field: string) => {
    const value = getSection(sectionKey)[field];
    return Array.isArray(value) ? value.map((item) => String(item)).join("\n") : "";
  };
  const getGalleryImages = () => {
    const raw = getSection("gallery").images;
    if (!Array.isArray(raw)) {
      return [] as Array<{ src: string; label: string; alt: string; span: string }>;
    }
    return raw.map((item) => {
      const obj =
        item && typeof item === "object" && !Array.isArray(item)
          ? (item as Record<string, unknown>)
          : {};
      return {
        src: String(obj.src || ""),
        label: String(obj.label || ""),
        alt: String(obj.alt || ""),
        span: String(obj.span || ""),
      };
    });
  };
  const setGalleryImages = (images: Array<{ src: string; label: string; alt: string; span: string }>) => {
    setField("gallery", "images", images);
  };
  const updateGalleryImage = (
    index: number,
    field: "src" | "label" | "alt" | "span",
    value: string,
  ) => {
    const images = getGalleryImages();
    if (!images[index]) return;
    images[index] = { ...images[index], [field]: value };
    setGalleryImages(images);
  };

  const setStringList = (sectionKey: string, field: string, text: string) => {
    const values = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    setField(sectionKey, field, values);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!pageQuery.data) return;
      await cmsApi.updatePage("home", {
        title: pageQuery.data.title,
        status: pageQuery.data.status,
        seo: pageQuery.data.seo,
        sections: sectionOrder.map((sectionKey, index) => ({
          sectionKey,
          sortOrder: index,
          data: sectionMap[sectionKey] as Record<string, unknown>,
        })),
      });
    },
    onSuccess: async () => {
      setSuccess("Saved successfully.");
      setError("");
      await queryClient.invalidateQueries({ queryKey: ["cms", "page", "home"] });
      await queryClient.invalidateQueries({ queryKey: ["cms", "site"] });
    },
    onError: (mutationError: unknown) => {
      setSuccess("");
      setError(mutationError instanceof Error ? mutationError.message : "Failed to save.");
    },
  });

  const applyAdvancedJson = () => {
    try {
      const parsed = JSON.parse(advancedJson) as Record<string, unknown>;
      setSectionMap(parsed);
      setSectionOrder(Object.keys(parsed));
      setError("");
    } catch {
      setError("Advanced JSON is invalid.");
    }
  };

  const copyText = async (value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setSuccess("Copied media path.");
    } catch {
      setError("Could not copy path. Copy manually.");
    }
  };

  const mediaItems = mediaQuery.data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Pages & Sections</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Simple form editor for non-technical users.
          </p>
        </div>
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="bg-primary px-4 py-2 text-primary-foreground text-xs tracking-[0.2em] uppercase disabled:opacity-60"
        >
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-green-400">{success}</p> : null}

      <div className="border border-border bg-card/60 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Media Helper</p>
          <Hint text="Select a media file, then click 'Use selected media' beside any image field." />
        </div>
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-3">
          <select
            value={selectedMediaPath}
            onChange={(event) => setSelectedMediaPath(event.target.value)}
            className="w-full border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">Select uploaded media...</option>
            {mediaItems.map((item) => (
              <option key={item.id} value={item.path}>
                {item.original_name} - {item.path}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => copyText(selectedMediaPath)}
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em]"
          >
            Copy Path
          </button>
          <a
            href="/backend/media"
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em] text-center"
          >
            Open Media
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Hero Banner</p>
            <Hint text="Main first screen. Portrait image controls the person image on the right." />
          </div>
          <input
            value={getString("hero", "firstName")}
            onChange={(event) => setField("hero", "firstName", event.target.value)}
            placeholder="First line title"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <input
            value={getString("hero", "lastName")}
            onChange={(event) => setField("hero", "lastName", event.target.value)}
            placeholder="Second line title"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <textarea
            value={getString("hero", "subtitle")}
            onChange={(event) => setField("hero", "subtitle", event.target.value)}
            placeholder="Subtitle"
            className="w-full h-20 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <input
            value={getString("hero", "portraitImage")}
            onChange={(event) => setField("hero", "portraitImage", event.target.value)}
            placeholder="Portrait image URL (/uploads/... or https://...)"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setField("hero", "portraitImage", selectedMediaPath)}
            disabled={!selectedMediaPath}
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
          >
            Use Selected Media
          </button>
        </section>

        <section className="border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">About</p>
            <Hint text="Edit the biography section and the image strip above it." />
          </div>
          <input
            value={getString("about", "image")}
            onChange={(event) => setField("about", "image", event.target.value)}
            placeholder="About image URL"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setField("about", "image", selectedMediaPath)}
            disabled={!selectedMediaPath}
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
          >
            Use Selected Media
          </button>
          <textarea
            value={getString("about", "paragraph1")}
            onChange={(event) => setField("about", "paragraph1", event.target.value)}
            placeholder="About paragraph 1"
            className="w-full h-24 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <textarea
            value={getString("about", "paragraph2")}
            onChange={(event) => setField("about", "paragraph2", event.target.value)}
            placeholder="About paragraph 2"
            className="w-full h-24 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
        </section>

        <section className="border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Kenyon</p>
            <Hint text="Company showcase section. Website link powers the Kenyon button." />
          </div>
          <input
            value={getString("kenyon", "image")}
            onChange={(event) => setField("kenyon", "image", event.target.value)}
            placeholder="Kenyon background image URL"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setField("kenyon", "image", selectedMediaPath)}
            disabled={!selectedMediaPath}
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
          >
            Use Selected Media
          </button>
          <textarea
            value={getString("kenyon", "description")}
            onChange={(event) => setField("kenyon", "description", event.target.value)}
            placeholder="Kenyon description"
            className="w-full h-24 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <input
            value={getString("kenyon", "website")}
            onChange={(event) => setField("kenyon", "website", event.target.value)}
            placeholder="Kenyon website URL"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
        </section>

        <section className="border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Foundation</p>
            <Hint text="Victor & Helen section. Image appears on the left." />
          </div>
          <textarea
            value={getString("impact", "description")}
            onChange={(event) => setField("impact", "description", event.target.value)}
            placeholder="Foundation description"
            className="w-full h-24 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <input
            value={getString("impact", "image")}
            onChange={(event) => setField("impact", "image", event.target.value)}
            placeholder="Foundation image URL"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setField("impact", "image", selectedMediaPath)}
            disabled={!selectedMediaPath}
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
          >
            Use Selected Media
          </button>
        </section>

        <section className="border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Founder's Letter</p>
            <Hint text="Closing message near the end of the homepage." />
          </div>
          <textarea
            value={getString("foundersLetter", "quote")}
            onChange={(event) => setField("foundersLetter", "quote", event.target.value)}
            placeholder="Main quote"
            className="w-full h-28 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <input
            value={getString("foundersLetter", "line")}
            onChange={(event) => setField("foundersLetter", "line", event.target.value)}
            placeholder="Short line"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
        </section>

        <section className="border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Contact</p>
            <Hint text="Final call-to-action section where engagement tags are shown." />
          </div>
          <textarea
            value={getString("contact", "subtitle")}
            onChange={(event) => setField("contact", "subtitle", event.target.value)}
            placeholder="Contact subtitle"
            className="w-full h-20 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <textarea
            value={getStringList("contact", "areas")}
            onChange={(event) => setStringList("contact", "areas", event.target.value)}
            placeholder={"Areas (one per line)\nSpeaking\nPartnerships"}
            className="w-full h-24 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
        </section>

        <section className="border border-border bg-card/60 p-4 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Gallery Images</p>
              <Hint text="Add or edit frames shown in homepage/gallery page. Use /uploads paths from media library." />
            </div>
            <button
              type="button"
              onClick={() =>
                setGalleryImages([
                  ...getGalleryImages(),
                  {
                    src: selectedMediaPath || "",
                    label: "New Frame",
                    alt: "Describe this image",
                    span: "",
                  },
                ])
              }
              className="border border-primary/30 px-3 py-1 text-xs uppercase tracking-[0.18em]"
            >
              Add Frame
            </button>
          </div>
          <div className="space-y-3">
            {getGalleryImages().map((image, index) => (
              <div key={`gallery-image-${index}`} className="border border-border/70 p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Frame {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const next = getGalleryImages().filter((_, i) => i !== index);
                      setGalleryImages(next);
                    }}
                    className="border border-red-500/40 px-2 py-1 text-[10px] uppercase text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <input
                  value={image.src}
                  onChange={(event) => updateGalleryImage(index, "src", event.target.value)}
                  placeholder="Image URL"
                  className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
                />
                <div className="grid md:grid-cols-2 gap-2">
                  <input
                    value={image.label}
                    onChange={(event) => updateGalleryImage(index, "label", event.target.value)}
                    placeholder="Label"
                    className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
                  />
                  <input
                    value={image.span}
                    onChange={(event) => updateGalleryImage(index, "span", event.target.value)}
                    placeholder="Span class (optional)"
                    className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
                  />
                </div>
                <textarea
                  value={image.alt}
                  onChange={(event) => updateGalleryImage(index, "alt", event.target.value)}
                  placeholder="Image description (alt text)"
                  className="w-full h-16 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => updateGalleryImage(index, "src", selectedMediaPath)}
                  disabled={!selectedMediaPath}
                  className="border border-primary/30 px-3 py-1 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
                >
                  Use Selected Media
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-border bg-card/60 p-4 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Social Posts (TikTok URLs)</p>
            <Hint text="Paste one TikTok video URL per line to show preview cards." />
          </div>
          <textarea
            value={getStringList("social", "tiktokPosts")}
            onChange={(event) => setStringList("social", "tiktokPosts", event.target.value)}
            placeholder={"One TikTok URL per line\nhttps://www.tiktok.com/@user/video/..."}
            className="w-full h-36 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
        </section>
      </div>

      <div className="border border-border bg-card/40 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdvancedOpen((current) => !current)}
            className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.2em]"
          >
            {advancedOpen ? "Hide Advanced JSON" : "Show Advanced JSON"}
          </button>
          <Hint text="For developers only. Normal editors can ignore this area." />
        </div>
        {advancedOpen ? (
          <>
            <textarea
              value={advancedJson}
              onChange={(event) => setAdvancedJson(event.target.value)}
              className="h-80 w-full border border-border bg-background/80 p-4 text-xs leading-6 font-mono outline-none focus:border-primary"
            />
            <button
              onClick={applyAdvancedJson}
              className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.2em] bg-primary/10"
            >
              Apply Advanced JSON
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

const emptyPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  status: "draft",
  publishAt: "",
  featuredImageUrl: "",
  categories: "",
  contentJson: JSON.stringify({ version: 1, blocks: [] }, null, 2),
  seo: "{}",
};

const PostsView = () => {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({ queryKey: ["cms", "posts"], queryFn: cmsApi.getPosts });
  const mediaQuery = useQuery({ queryKey: ["cms", "media"], queryFn: cmsApi.getMedia });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyPostForm);
  const [selectedPostMediaPath, setSelectedPostMediaPath] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt,
        status: form.status,
        publishAt: form.publishAt ? new Date(form.publishAt).toISOString() : null,
        featuredImageUrl: form.featuredImageUrl || null,
        categories: form.categories
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        contentJson: JSON.parse(form.contentJson),
        seo: JSON.parse(form.seo || "{}"),
      };

      if (editingId) {
        await cmsApi.updatePost(editingId, payload);
      } else {
        await cmsApi.createPost(payload);
      }
    },
    onSuccess: async () => {
      setSuccess(editingId ? "Post updated." : "Post created.");
      setError("");
      setEditingId(null);
      setForm(emptyPostForm);
      await queryClient.invalidateQueries({ queryKey: ["cms", "posts"] });
    },
    onError: (mutationError: unknown) => {
      setSuccess("");
      setError(mutationError instanceof Error ? mutationError.message : "Failed to save post.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cmsApi.deletePost(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cms", "posts"] });
    },
  });

  const startEdit = (post: CmsPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      status: post.status,
      publishAt: post.publishAt ? post.publishAt.slice(0, 16) : "",
      featuredImageUrl: post.featuredImageUrl || "",
      categories: post.categories.map((category) => category.name).join(", "),
      contentJson: JSON.stringify(post.contentJson || { version: 1, blocks: [] }, null, 2),
      seo: JSON.stringify(post.seo || {}, null, 2),
    });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    try {
      JSON.parse(form.contentJson);
      JSON.parse(form.seo || "{}");
    } catch {
      setError("Content JSON or SEO JSON is invalid.");
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-3xl">Blog Manager</h2>
          <Hint text="Create and publish blog posts. Published posts appear on /blog." />
        </div>
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em]"
        >
          Open Blog Page
        </a>
      </div>
      <div className="grid xl:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="border border-border bg-card/60 p-5 space-y-4">
          <p className="text-sm text-muted-foreground">{editingId ? "Edit Post" : "Create Post"}</p>
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Title"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <input
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            placeholder="Slug (optional)"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <textarea
            value={form.excerpt}
            onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
            placeholder="Excerpt"
            className="w-full h-20 border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
              className="border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input
              type="datetime-local"
              value={form.publishAt}
              onChange={(event) => setForm((current) => ({ ...current, publishAt: event.target.value }))}
              className="border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
            />
          </div>
          <input
            value={form.featuredImageUrl}
            onChange={(event) => setForm((current) => ({ ...current, featuredImageUrl: event.target.value }))}
            placeholder="Featured image URL"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <div className="grid sm:grid-cols-[1fr_auto] gap-3">
            <select
              value={selectedPostMediaPath}
              onChange={(event) => setSelectedPostMediaPath(event.target.value)}
              className="w-full border border-border bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Select media for featured image...</option>
              {(mediaQuery.data?.items || []).map((item) => (
                <option key={item.id} value={item.path}>
                  {item.original_name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  featuredImageUrl: selectedPostMediaPath || current.featuredImageUrl,
                }))
              }
              disabled={!selectedPostMediaPath}
              className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.18em] disabled:opacity-50"
            >
              Use Media
            </button>
          </div>
          <input
            value={form.categories}
            onChange={(event) => setForm((current) => ({ ...current, categories: event.target.value }))}
            placeholder="Categories (comma separated)"
            className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
          />
          <textarea
            value={form.contentJson}
            onChange={(event) => setForm((current) => ({ ...current, contentJson: event.target.value }))}
            className="w-full h-44 border border-border bg-background/80 px-3 py-2 font-mono text-xs outline-none focus:border-primary"
          />
          <textarea
            value={form.seo}
            onChange={(event) => setForm((current) => ({ ...current, seo: event.target.value }))}
            className="w-full h-28 border border-border bg-background/80 px-3 py-2 font-mono text-xs outline-none focus:border-primary"
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {success ? <p className="text-sm text-green-400">{success}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-primary px-4 py-2 text-xs tracking-[0.2em] uppercase text-primary-foreground disabled:opacity-60"
            >
              {saveMutation.isPending ? "Saving..." : editingId ? "Update Post" : "Create Post"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyPostForm);
                  setError("");
                  setSuccess("");
                }}
                className="border border-primary/30 px-4 py-2 text-xs tracking-[0.2em] uppercase"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="border border-border bg-card/60 p-5 overflow-auto">
          <p className="text-sm text-muted-foreground mb-3">Existing Posts</p>
          <div className="space-y-3">
            {postsQuery.data?.items.map((post) => (
              <div key={post.id} className="border border-border p-3">
                <p className="font-semibold">{post.title}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  /{post.slug} - {post.status}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(post)} className="border border-primary/30 px-3 py-1 text-xs uppercase">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(post.id)}
                    className="border border-red-500/40 px-3 py-1 text-xs uppercase text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaView = () => {
  const queryClient = useQueryClient();
  const mediaQuery = useQuery({ queryKey: ["cms", "media"], queryFn: cmsApi.getMedia });
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Select a file first.");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", altText);
      await cmsApi.uploadMedia(formData);
    },
    onSuccess: async () => {
      setFile(null);
      setAltText("");
      setError("");
      await queryClient.invalidateQueries({ queryKey: ["cms", "media"] });
    },
    onError: (mutationError: unknown) => {
      setError(mutationError instanceof Error ? mutationError.message : "Upload failed.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cmsApi.deleteMedia(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cms", "media"] });
    },
  });

  const submitUpload = (event: FormEvent) => {
    event.preventDefault();
    uploadMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-3xl">Media Library</h2>
        <Hint text="Upload files here, then copy the path and paste into image fields in Pages or Blog." />
      </div>
      <form onSubmit={submitUpload} className="border border-border bg-card/60 p-5 space-y-4">
        <input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="block w-full text-sm"
        />
        <input
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          placeholder="Alt text (optional)"
          className="w-full border border-border bg-background/80 px-3 py-2 outline-none focus:border-primary"
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          disabled={uploadMutation.isPending}
          className="bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload"}
        </button>
      </form>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {mediaQuery.data?.items.map((item) => (
          <div key={item.id} className="border border-border bg-card/60 p-3">
            {item.mime_type.startsWith("image/") ? (
              <img src={item.path} alt={item.alt_text || item.original_name} className="h-44 w-full object-cover mb-3" />
            ) : (
              <a href={item.path} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
                Open file
              </a>
            )}
            <p className="text-xs text-muted-foreground truncate">{item.original_name}</p>
            <p className="text-xs text-muted-foreground mb-2">{item.path}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(item.path);
                    setError("");
                  } catch {
                    setError("Could not copy path.");
                  }
                }}
                className="border border-primary/30 px-3 py-1 text-xs uppercase"
              >
                Copy Path
              </button>
              <a href="/backend/pages" className="border border-primary/30 px-3 py-1 text-xs uppercase">
                Use in Pages
              </a>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(item.id)}
                className="border border-red-500/40 px-3 py-1 text-xs uppercase text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsView = () => {
  const queryClient = useQueryClient();
  const siteQuery = useQuery({ queryKey: ["cms", "site"], queryFn: cmsApi.getSite });
  const [jsonValue, setJsonValue] = useState("{}");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (siteQuery.data?.siteSettings) {
      setJsonValue(JSON.stringify(siteQuery.data.siteSettings, null, 2));
    }
  }, [siteQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsed = JSON.parse(jsonValue) as Record<string, unknown>;
      await cmsApi.updateSite(parsed);
    },
    onSuccess: async () => {
      setSuccess("Site settings updated.");
      setError("");
      await queryClient.invalidateQueries({ queryKey: ["cms", "site"] });
    },
    onError: (mutationError: unknown) => {
      setSuccess("");
      setError(mutationError instanceof Error ? mutationError.message : "Failed to update settings.");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-3xl">Site Settings</h2>
        <Hint text="Advanced global settings (logo URL, nav labels, footer links). Use only if needed." />
      </div>
      <div className="border border-border bg-card/60 p-5 space-y-4">
        <textarea
          value={jsonValue}
          onChange={(event) => setJsonValue(event.target.value)}
          className="h-[520px] w-full border border-border bg-background/80 p-4 text-xs leading-6 font-mono outline-none focus:border-primary"
        />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {success ? <p className="text-sm text-green-400">{success}</p> : null}
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
        >
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

const ProfileView = ({ email }: { email: string }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const changeMutation = useMutation({
    mutationFn: () => cmsApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setMessage("Password changed.");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (mutationError: unknown) => {
      setMessage("");
      setError(mutationError instanceof Error ? mutationError.message : "Could not change password.");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-3xl">Profile & Security</h2>
        <Hint text="Use this page to change your admin password." />
      </div>
      <div className="border border-border bg-card/60 p-5 space-y-4">
        <p className="text-sm text-muted-foreground">
          Logged in as <span className="text-foreground">{email}</span>
        </p>
        <div className="flex items-center border border-border bg-background/80 focus-within:border-primary">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Current password"
            className="w-full bg-transparent px-3 py-2 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((current) => !current)}
            className="px-3 text-muted-foreground hover:text-foreground"
            aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
          >
            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center border border-border bg-background/80 focus-within:border-primary">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password (min 8 chars)"
            className="w-full bg-transparent px-3 py-2 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((current) => !current)}
            className="px-3 text-muted-foreground hover:text-foreground"
            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
          >
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Password should be at least 8 characters.</p>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-green-400">{message}</p> : null}
        <button
          onClick={() => changeMutation.mutate()}
          className="bg-primary px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

const Backend = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeView = useMemo(() => toView(location.pathname), [location.pathname]);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: cmsApi.me,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: cmsApi.logout,
    onSuccess: () => {
      navigate("/backend/login", { replace: true });
    },
  });

  if (meQuery.isLoading) {
    return <div className="min-h-screen bg-background p-8 text-sm text-muted-foreground">Checking session...</div>;
  }

  if (!meQuery.data?.authenticated) {
    return <Navigate to="/backend/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-primary/20 px-6 py-4 flex items-center justify-between">
        <p className="font-display text-2xl">
          CMS <span className="text-gradient-gold">Backend</span>
        </p>
        <button
          onClick={() => logoutMutation.mutate()}
          className="border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.2em]"
        >
          Logout
        </button>
      </header>
      <div className="grid lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-primary/10 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`block border px-3 py-2 text-sm ${
                activeView === item.key ? "border-primary bg-primary/10" : "border-border"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <main className="p-6">
          <p className="text-xs text-muted-foreground mb-4">
            Hover the <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-primary/40 text-[10px] text-primary">i</span> icons for guidance.
          </p>
          {activeView === "dashboard" ? <DashboardView /> : null}
          {activeView === "pages" ? <PagesView /> : null}
          {activeView === "posts" ? <PostsView /> : null}
          {activeView === "media" ? <MediaView /> : null}
          {activeView === "settings" ? <SettingsView /> : null}
          {activeView === "profile" ? <ProfileView email={meQuery.data.admin?.email || ""} /> : null}
        </main>
      </div>
    </div>
  );
};

export default Backend;
