export type FallbackResult<T> = { data: T; usedFallback: boolean };

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

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  if (!ms || ms <= 0) return promise;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms),
    ),
  ]);
}

export async function withFallback<T>(
  domain: string,
  apiCall: () => Promise<T>,
  fallback: () => T,
  options?: { silent?: boolean; timeoutMs?: number },
): Promise<T> {
  try {
    const call = apiCall();
    const result = options?.timeoutMs ? await withTimeout(call, options.timeoutMs, domain) : await call;
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

export async function withFallbackMeta<T>(
  domain: string,
  apiCall: () => Promise<T>,
  fallback: () => T,
  options?: { silent?: boolean; timeoutMs?: number },
): Promise<FallbackResult<T>> {
  try {
    const call = apiCall();
    const result = options?.timeoutMs ? await withTimeout(call, options.timeoutMs, domain) : await call;
    log("info", domain, "API data fetched successfully");
    return { data: result, usedFallback: false };
  } catch (err) {
    const fallbackData = fallback();
    const message = err instanceof Error ? err.message : String(err);
    if (!options?.silent) {
      log("warn", domain, `API failed (${message}), using fallback data`);
    }
    return { data: fallbackData, usedFallback: true };
  }
}
