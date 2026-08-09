const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Builds a usable image URL from a backend-provided path.
 * - Absolute URLs (http/https) are returned as-is.
 * - Relative paths (e.g. "uploads/abc.jpg") are prefixed with API_BASE_URL.
 * - Empty values return "" so callers can fall back to a placeholder.
 */
export function getImageUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\//, "")}`;
}

export default API_BASE_URL;