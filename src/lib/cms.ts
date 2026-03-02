const CSRF_STORAGE_KEY = "ve_csrf_token";

let inMemoryCsrfToken: string | null = null;

const canUseWindow = typeof window !== "undefined";

const getStoredCsrf = () => {
  if (!canUseWindow) {
    return null;
  }
  return window.localStorage.getItem(CSRF_STORAGE_KEY);
};

export const getCsrfToken = () => inMemoryCsrfToken || getStoredCsrf();

export const setCsrfToken = (token: string | null) => {
  inMemoryCsrfToken = token;
  if (!canUseWindow) {
    return;
  }
  if (token) {
    window.localStorage.setItem(CSRF_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(CSRF_STORAGE_KEY);
  }
};

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  csrf?: boolean;
}

const apiRequest = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  let body: BodyInit | undefined;

  if (isFormData) {
    body = options.body as FormData;
  } else if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.body);
  }

  if (options.csrf) {
    const token = getCsrfToken();
    if (!token) {
      throw new Error("Missing CSRF token. Login again.");
    }
    headers.set("x-csrf-token", token);
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    credentials: "include",
    headers,
    body,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error: string }).error)
        : response.statusText || "Request failed";
    throw new Error(message);
  }

  return payload as T;
};

export interface AuthMeResponse {
  authenticated: boolean;
  admin?: {
    id: number;
    email: string;
    displayName: string;
  };
  csrfToken?: string;
}

export interface CmsPageSection {
  id: number;
  sectionKey: string;
  sortOrder: number;
  data: Record<string, unknown>;
}

export interface CmsPage {
  id: number;
  slug: string;
  title: string;
  status: "draft" | "published";
  seo: Record<string, unknown>;
  sections: CmsPageSection[];
}

export interface CmsSitePayload {
  siteSettings: Record<string, unknown>;
  settingsUpdatedAt: string | null;
  pages: Array<{
    slug: string;
    title: string;
    status: "draft" | "published";
    updatedAt: string;
  }>;
}

export interface CmsPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  contentJson: Record<string, unknown>;
  featuredImageUrl: string | null;
  status: "draft" | "published";
  publishAt: string | null;
  seo: Record<string, unknown>;
  categories: Array<{ id: number; name: string; slug: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface CmsMediaItem {
  id: number;
  filename: string;
  original_name: string;
  path: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  created_at: string;
}

export const cmsApi = {
  login: async (email: string, password: string) => {
    const result = await apiRequest<AuthMeResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (result.csrfToken) {
      setCsrfToken(result.csrfToken);
    }
    return result;
  },
  logout: async () => {
    const result = await apiRequest<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
    setCsrfToken(null);
    return result;
  },
  me: async () => {
    const result = await apiRequest<AuthMeResponse>("/api/auth/me");
    setCsrfToken(result.authenticated ? result.csrfToken || null : null);
    return result;
  },
  changePassword: async (currentPassword: string, newPassword: string) =>
    apiRequest<{ ok: boolean }>("/api/auth/password", {
      method: "POST",
      body: { currentPassword, newPassword },
      csrf: true,
    }),

  getSite: () => apiRequest<CmsSitePayload>("/api/site"),
  updateSite: (settings: Record<string, unknown>) =>
    apiRequest<{ ok: boolean; settings: Record<string, unknown> }>("/api/site", {
      method: "PUT",
      body: { settings },
      csrf: true,
    }),

  getPage: (slug: string) => apiRequest<CmsPage>(`/api/pages/${slug}`),
  updatePage: (
    slug: string,
    payload: {
      title?: string;
      status?: "draft" | "published";
      seo?: Record<string, unknown>;
      sections?: Array<{
        sectionKey: string;
        sortOrder?: number;
        data: Record<string, unknown> | unknown[] | string | number | boolean | null;
      }>;
    },
  ) =>
    apiRequest<CmsPage>(`/api/pages/${slug}`, {
      method: "PUT",
      body: payload,
      csrf: true,
    }),

  getPosts: () => apiRequest<{ items: CmsPost[] }>("/api/posts"),
  getPublicPosts: () => apiRequest<{ items: CmsPost[] }>("/api/posts?status=published"),
  getPostBySlug: (slug: string) => apiRequest<CmsPost>(`/api/posts/${slug}`),
  createPost: (payload: Record<string, unknown>) =>
    apiRequest<CmsPost>("/api/posts", {
      method: "POST",
      body: payload,
      csrf: true,
    }),
  updatePost: (id: number, payload: Record<string, unknown>) =>
    apiRequest<CmsPost>(`/api/posts/${id}`, {
      method: "PUT",
      body: payload,
      csrf: true,
    }),
  deletePost: (id: number) =>
    apiRequest<{ ok: boolean }>(`/api/posts/${id}`, {
      method: "DELETE",
      csrf: true,
    }),

  getMedia: () => apiRequest<{ items: CmsMediaItem[] }>("/api/media"),
  uploadMedia: (formData: FormData) =>
    apiRequest<CmsMediaItem>("/api/uploads", {
      method: "POST",
      body: formData,
      csrf: true,
    }),
  deleteMedia: (id: number) =>
    apiRequest<{ ok: boolean }>(`/api/media/${id}`, {
      method: "DELETE",
      csrf: true,
    }),
};

export const toSectionMap = (page?: CmsPage | null) => {
  if (!page) {
    return {};
  }
  return page.sections.reduce<Record<string, Record<string, unknown>>>((acc, section) => {
    acc[section.sectionKey] = section.data || {};
    return acc;
  }, {});
};
