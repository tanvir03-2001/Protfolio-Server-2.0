const UPLOAD_MARKERS = ["/image/upload/", "/raw/upload/", "/video/upload/"];

function getUploadMarker(url) {
  for (const marker of UPLOAD_MARKERS) {
    if (url.includes(marker)) return marker;
  }
  return null;
}

function isTransformationSegment(segment) {
  return /^v\d+$/.test(segment) || segment.includes(",");
}

/** Extract Cloudinary public_id from a delivery URL. */
export function cloudinaryPublicIdFromUrl(url) {
  const trimmed = String(url || "").trim();
  const marker = getUploadMarker(trimmed);
  if (!marker) return null;

  let rest = trimmed.slice(trimmed.indexOf(marker) + marker.length);
  rest = rest.split("?")[0];

  const segments = rest.split("/").filter(Boolean);
  let index = 0;

  while (index < segments.length && isTransformationSegment(segments[index])) {
    index += 1;
  }

  const publicIdWithExt = segments.slice(index).join("/");
  if (!publicIdWithExt) return null;

  return publicIdWithExt.replace(/\.[^/.]+$/, "");
}

export function cloudinaryResourceTypeFromUrl(url) {
  if (url.includes("/raw/upload/")) return "raw";
  if (url.includes("/video/upload/")) return "video";
  return "image";
}

export function cloudinaryCloudNameFromUrl(url) {
  try {
    const pathname = new URL(url.trim()).pathname;
    const parts = pathname.split("/").filter(Boolean);
    return parts[0] || null;
  } catch {
    return null;
  }
}

export function assertDeletableCloudinaryUrl(url) {
  const trimmed = String(url || "").trim();
  const publicId = cloudinaryPublicIdFromUrl(trimmed);

  if (!publicId) {
    throw new Error("Invalid Cloudinary URL");
  }

  if (!publicId.startsWith("portfolio/")) {
    throw new Error("Only portfolio assets can be deleted");
  }

  const configuredCloud = process.env.CLOUDINARY_CLOUD_NAME;
  const urlCloud = cloudinaryCloudNameFromUrl(trimmed);

  if (configuredCloud && urlCloud && configuredCloud !== urlCloud) {
    throw new Error("Cloudinary cloud name mismatch");
  }

  return {
    publicId,
    resourceType: cloudinaryResourceTypeFromUrl(trimmed),
  };
}
