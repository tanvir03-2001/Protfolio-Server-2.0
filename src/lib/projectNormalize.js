function isRemoteMediaUrl(url) {
  return /^https?:\/\//i.test(String(url).trim());
}

function sanitizeMediaUrl(url) {
  const trimmed = String(url ?? "").trim();
  if (!isRemoteMediaUrl(trimmed)) return "";
  return trimmed;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToHtml(text) {
  return String(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function normalizeProjectLinks(project = {}) {
  if (Array.isArray(project.links) && project.links.length > 0) {
    return project.links
      .map((link) => ({
        label: String(link.label ?? "").trim(),
        href: String(link.href ?? "").trim(),
      }))
      .filter((link) => link.label || link.href);
  }

  const legacy = [];
  const href = String(project.href ?? "").trim();
  const repo = String(project.repo ?? "").trim();
  if (href && href !== "#") legacy.push({ label: "Live demo", href });
  if (repo && repo !== "#") legacy.push({ label: "Code", href: repo });
  return legacy;
}
function normalizeDetails(details) {
  if (!Array.isArray(details)) return [];

  return details
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const label = String(item.label ?? "").trim();
      const value = String(item.value ?? "").trim();
      if (!label && !value) return null;
      return { label, value };
    })
    .filter(Boolean);
}

export function normalizeProject(project = {}) {
  const cover = sanitizeMediaUrl(project.image);
  const rawGallery = Array.isArray(project.images)
    ? project.images.map((url) => sanitizeMediaUrl(url)).filter(Boolean)
    : [];

  const images = rawGallery.filter((url) => url !== cover);
  const description = String(project.description ?? "").trim();
  const fullDescription =
    String(project.fullDescription ?? "").trim() || textToHtml(description);

  return {
    slug: String(project.slug ?? "").trim(),
    title: String(project.title ?? "").trim(),
    description,
    fullDescription,
    image: cover,
    images,
    details: normalizeDetails(project.details),
    tags: Array.isArray(project.tags)
      ? project.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],
    links: normalizeProjectLinks(project),
  };
}

export function normalizeProjects(projects) {
  if (!Array.isArray(projects)) return [];
  return projects.map((project) => normalizeProject(project));
}

export function normalizeSite(site = {}) {
  const resumeHref = sanitizeMediaUrl(site.resumeHref);

  return {
    ...site,
    resumeHref,
    projects: normalizeProjects(site.projects),
  };
}

export function normalizeProfile(profile = {}) {
  return {
    ...profile,
    image: sanitizeMediaUrl(profile.image),
  };
}
