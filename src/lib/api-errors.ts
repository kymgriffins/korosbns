export type ApiPayload = Record<string, unknown>;

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
