export type ApiPayload = Record<string, unknown>;

export class ApiRequestError extends Error {
  readonly status: number;
  readonly fields?: Record<string, string[]>;

  constructor(message: string, status: number, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fields = fields;
  }
}

export function extractFieldErrors(payload: ApiPayload): Record<string, string[]> | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const fields: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key === "detail" || key === "non_field_errors") continue;
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      fields[key] = value as string[];
    }
  }
  return Object.keys(fields).length > 0 ? fields : undefined;
}

export function extractApiErrorMessage(
  payload: ApiPayload,
  fallback = "An unexpected error occurred.",
): string {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const primary = payload.detail ?? payload.message ?? payload.error;
  if (typeof primary === "string" && primary.trim()) {
    return primary;
  }

  if (
    Array.isArray(payload.non_field_errors) &&
    payload.non_field_errors.length
  ) {
    const first = payload.non_field_errors[0];
    if (typeof first === "string" && first.trim()) {
      return first;
    }
  }

  const fieldErrors = extractFieldErrors(payload);
  if (fieldErrors) {
    const entries = Object.entries(fieldErrors);
    return `${entries.length} field(s) failed validation.`;
  }

  for (const value of Object.values(payload)) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    if (
      Array.isArray(value) &&
      value.length &&
      typeof value[0] === "string" &&
      value[0].trim()
    ) {
      return value[0];
    }
  }

  return fallback;
}
