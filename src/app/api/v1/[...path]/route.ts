import { getApiProxyTarget } from "@/lib/api-config";

type RouteContext = { params: Promise<{ path: string[] }> };

/**
 * Server-side proxy for /api/v1/* — more reliable than next.config rewrites for POST on Vercel.
 * Browser calls same-origin /api/v1/auth/register/ → this handler → BNSKE Django API.
 */
async function proxyRequest(request: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const segment = path.join("/");
  const target = getApiProxyTarget().replace(/\/+$/, "");
  const incoming = new URL(request.url);
  const upstream = new URL(`${target}/api/v1/${segment}/`);
  upstream.search = incoming.search;

  // Mirror the original request's credentials so the upstream receives cookies
  const cookie = request.headers.get("cookie");

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Accept", request.headers.get("accept") || "application/json");
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);
  if (cookie) headers.set("Cookie", cookie);

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstream.toString(), {
      method,
      headers,
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream API unreachable";
    return Response.json(
      { detail: `API proxy error: ${message}` },
      { status: 502 },
    );
  }

  const responseBody = await upstreamResponse.text();
  const outHeaders = new Headers();
  const upstreamType = upstreamResponse.headers.get("content-type");
  if (upstreamType) outHeaders.set("Content-Type", upstreamType);

  // Diagnostic: log first 200 chars of login response body
  if (segment === "auth/login" || segment.startsWith("auth/")) {
    console.log("[API Proxy] upstream status:", upstreamResponse.status, "body preview:", responseBody.slice(0, 200));
  }

  return new Response(responseBody, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: outHeaders,
  });
}

export async function GET(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function OPTIONS(request: Request, context: RouteContext) {
  return proxyRequest(request, context);
}
