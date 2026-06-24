import { usePathname } from "next/navigation";

export function useRouteBase(): string {
  const path = usePathname();
  return path.match(/^(\/[^/]+)?\/(?:dashboard|auth|chat|mail|unauthorized)/)?.at(1) ?? "";
}

export function getFullUrl(routeBase: string, url: string): string {
  return `${routeBase}${url}`;
}

export function getLocalPath(routeBase: string, path: string): string {
  return (routeBase ? path.slice(routeBase.length) : path).replace(/\/$/, "");
}
