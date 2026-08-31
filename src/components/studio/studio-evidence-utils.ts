import type { StudioContentType } from "@/constants/bns-studio-content";

export function contentTypeSlug(type: StudioContentType): string {
  return type
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-");
}
