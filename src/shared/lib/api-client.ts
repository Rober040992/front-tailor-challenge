const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type ApiError = {
  statusCode: number;
  error: string;
  message: string;
  path?: string;
  timestamp?: string;
  details?: {
    field: string;
    message: string;
  }[];
};

type ApiClientOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null;
};

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL environment variable.");
  }

  return API_BASE_URL;
}

function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl().replace(/\/+$/, "");
  const requestPath = path.replace(/^\/+/, "");

  return `${baseUrl}/${requestPath}`;
}

function isJsonBody(body: ApiClientOptions["body"]): body is object {
  return (
    typeof body === "object" &&
    body !== null &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(body) &&
    !(typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
  );
}

function buildRequestBody(
  body: ApiClientOptions["body"],
  headers: Headers,
): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isJsonBody(body)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return JSON.stringify(body);
  }

  return body;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildFallbackError(
  response: Response,
  data: unknown,
  path: string,
): ApiError {
  return {
    statusCode: response.status,
    error: response.statusText || "HTTP_ERROR",
    message: typeof data === "string" && data ? data : "Request failed.",
    path,
    timestamp: new Date().toISOString(),
  };
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const body = buildRequestBody(options.body, headers);
  const url = buildApiUrl(path);

  const response = await fetch(url, {
    ...options,
    body,
    headers,
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    if (typeof data === "object" && data !== null) {
      throw data;
    }

    throw buildFallbackError(response, data, path);
  }

  return data as T;
}
