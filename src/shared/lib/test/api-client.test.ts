import { describe, expect, it, vi } from "vitest";

async function loadApiClient() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.test/");

  return import("../api-client");
}

describe("apiClient", () => {
  it("sends requests with cookie credentials", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { apiClient } = await loadApiClient();

    await apiClient("/restaurants");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/restaurants",
      expect.objectContaining({
        credentials: "include",
      }),
    );
  });

  it("throws the backend error response when the request fails", async () => {
    const backendError = {
      error: "UNAUTHORIZED",
      message: "Invalid username or password.",
      statusCode: 401,
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify(backendError), {
            status: 401,
            statusText: "Unauthorized",
          }),
      ),
    );

    const { apiClient } = await loadApiClient();

    await expect(apiClient("/auth/login")).rejects.toEqual(backendError);
  });
});
