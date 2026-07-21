import { adminMediaApi } from "@/lib/admin-api";
import type { AdminMediaUploadResult } from "@/lib/admin-api";
import { withFallback } from "@/data/adapter";

export type { AdminMediaUploadResult };

export const adminMediaData = {
  upload: (file: File, altText?: string) =>
    withFallback(
      "admin-media",
      () => adminMediaApi.upload(file, altText),
      () => ({ id: `local-${Date.now()}`, location: "", url: URL.createObjectURL(file) }),
    ),
};
