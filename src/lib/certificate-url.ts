import { API_BASE_URL } from "@/lib/api-config";
import { resolveAppUrl } from "@/lib/api-url";

/** Same-origin or absolute URL for certificate HTML download. */
export function certificateDownloadHref(certId: string): string {
  const path = `/api/gamification/certificates/${certId}/download/`;
  if (API_BASE_URL) {
    return `${API_BASE_URL.replace(/\/+$/, "")}${path}`;
  }
  return resolveAppUrl(path);
}

export function certificateDownloadHrefFromRecord(
  cert: { id: string; certificate_url?: string | null },
): string {
  if (cert.certificate_url?.startsWith("http")) return cert.certificate_url;
  if (cert.certificate_url?.startsWith("/api/")) {
    if (API_BASE_URL) return `${API_BASE_URL.replace(/\/+$/, "")}${cert.certificate_url}`;
    return resolveAppUrl(cert.certificate_url);
  }
  return certificateDownloadHref(cert.id);
}
