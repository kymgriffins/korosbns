/**
 * Universal safe access helpers for API response data.
 * Every API data field that reaches a component should be
 * unwrapped through one of these to prevent runtime crashes
 * when the backend schema drifts from the frontend types.
 */

export function safeArray<T>(value: T[] | null | undefined, fallback: T[] = []): T[] {
  return value ?? fallback;
}

export function safeNum(value: number | null | undefined, fallback: number = 0): number {
  return value ?? fallback;
}

export function safeStr(value: string | null | undefined, fallback: string = ""): string {
  return value ?? fallback;
}

export function safeVal<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

/**
 * Wrap a map/filter/reduce call so it never crashes on undefined.
 *
 * Before:
 *   items.map(fn)
 *   data.posts.length
 *
 * After:
 *   safeMap(items, fn)
 *   safeLen(data.posts)
 */
export function safeMap<T, U>(arr: T[] | null | undefined, fn: (item: T, idx: number) => U): U[] {
  return (arr ?? []).map(fn);
}

export function safeLen(arr: unknown[] | null | undefined): number {
  return arr?.length ?? 0;
}