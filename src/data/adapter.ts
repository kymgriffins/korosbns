export class DataError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly usedFallback: boolean = false,
  ) {
    super(message);
    this.name = "DataError";
  }
}

let _logging = true;

export function setDataLogging(enabled: boolean): void {
  _logging = enabled;
}

function log(type: "info" | "warn" | "error", domain: string, message: string, extra?: unknown): void {
  if (!_logging) return;
  const prefix = `[Data:${domain}]`;
  switch (type) {
    case "warn":
      console.warn(prefix, message, extra ?? "");
      break;
    case "error":
      console.error(prefix, message, extra ?? "");
      break;
    default:
      console.log(prefix, message, extra ?? "");
  }
}

export async function withFallback<T>(
  domain: string,
  apiCall: () => Promise<T>,
  fallback: () => T,
  options?: { silent?: boolean },
): Promise<T> {
  try {
    const result = await apiCall();
    log("info", domain, "API data fetched successfully");
    return result;
  } catch (err) {
    const fallbackData = fallback();
    const message = err instanceof Error ? err.message : String(err);
    if (!options?.silent) {
      log("warn", domain, `API failed (${message}), using fallback data`);
    }
    return fallbackData;
  }
}
