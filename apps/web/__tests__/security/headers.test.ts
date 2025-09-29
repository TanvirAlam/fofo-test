import { middleware } from "../../src/middleware";

// Minimal mock for NextResponse.next()
jest.mock("next/server", () => ({
  NextResponse: {
    next: () => {
      const store = new Map<string, string>();
      return {
        headers: {
          set: (key: string, value: string) =>
            store.set(key.toLowerCase(), value),
          get: (key: string) => store.get(key.toLowerCase()) || null,
        },
      };
    },
  },
}));

describe("Security Headers", () => {
  const fakeRequest = {} as unknown as import("next/server").NextRequest;

  it("should set CSP headers", async () => {
    const res = await middleware(fakeRequest);
    expect(res.headers.get("Content-Security-Policy")).toBeTruthy();
  });

  it("should set X-Frame-Options", async () => {
    const res = await middleware(fakeRequest);
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
  });

  it("should set Strict-Transport-Security in production", async () => {
    const originalEnv = process.env;

    process.env = { ...originalEnv, NODE_ENV: "production" };

    const res = await middleware(fakeRequest);
    expect(res.headers.get("Strict-Transport-Security")).toBeTruthy();

    process.env = originalEnv;
  });
});
