import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const REQUEST_HEADERS_TO_FORWARD = ["cookie", "content-type", "accept"];

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildForwardedHeaders(request: NextRequest): Headers {
  const headers = new Headers();

  for (const headerName of REQUEST_HEADERS_TO_FORWARD) {
    const value = request.headers.get(headerName);

    if (value) {
      headers.set(headerName, value);
    }
  }

  return headers;
}

function jsonError(status: number, error: string, message: string): Response {
  return Response.json(
    {
      statusCode: status,
      error,
      message,
    },
    { status },
  );
}

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  const backendApiUrl = process.env.BACKEND_API_URL?.replace(/\/+$/, "");

  if (!backendApiUrl) {
    return jsonError(
      500,
      "CONFIGURATION_ERROR",
      "Missing BACKEND_API_URL environment variable.",
    );
  }

  const { path = [] } = await context.params;
  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  const targetUrl = new URL(`${backendApiUrl}/${encodedPath}`);
  targetUrl.search = request.nextUrl.search;

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  try {
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers: buildForwardedHeaders(request),
      body: body && body.byteLength > 0 ? body : undefined,
      redirect: "manual",
    });

    return new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });
  } catch (error) {
    return jsonError(
      502,
      "BAD_GATEWAY",
      error instanceof Error ? error.message : "Backend API request failed.",
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return proxyRequest(request, context);
}

export async function HEAD(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  return proxyRequest(request, context);
}
