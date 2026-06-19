const NAIROBI_TZ = "Africa/Nairobi";

export function formatInNairobi(
  iso: string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-KE", {
      ...options,
      timeZone: NAIROBI_TZ,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export { NAIROBI_TZ };
