import { fetchData } from "../../src/services/api";
import { FETCH_ERROR_MESSAGE } from "../../src/constants/common";

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

beforeEach(() => {
  mockFetch.mockReset();
});

describe.skip("API Service", () => {
  describe("fetchData", () => {
    test("should fetch and return data successfully", async () => {
      const mockData = { id: 1, name: "Test Restaurant" };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchData("https://api.example.com/restaurants");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/restaurants"
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test("should handle HTTP error responses", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: jest.fn(),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchData("https://api.example.com/not-found");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/not-found"
      );
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Fetch error:",
        new Error(FETCH_ERROR_MESSAGE)
      );
    });

    test("should handle network errors", async () => {
      const networkError = new Error("Network error");
      mockFetch.mockRejectedValue(networkError);

      const result = await fetchData("https://api.example.com/offline");

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/offline");
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith("Fetch error:", networkError);
    });

    test("should handle JSON parsing errors", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchData("https://api.example.com/invalid-json");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/invalid-json"
      );
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "Fetch error:",
        new Error("Invalid JSON")
      );
    });

    test("should handle different HTTP status codes", async () => {
      const statusCodes = [400, 401, 403, 404, 500, 502, 503];

      for (const status of statusCodes) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status,
          statusText: `HTTP ${status}`,
          json: jest.fn(),
        } as any);

        const result = await fetchData(
          `https://api.example.com/status-${status}`
        );
        expect(result).toBeNull();
      }

      expect(mockFetch).toHaveBeenCalledTimes(statusCodes.length);
    });

    test("should handle empty response data", async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(null),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchData("https://api.example.com/empty");

      expect(result).toBeNull();
    });

    test("should handle large response data", async () => {
      const largeData = {
        items: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: "A".repeat(1000),
        })),
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(largeData),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchData("https://api.example.com/large-data");

      expect(result).toEqual(largeData);
      expect(result.items).toHaveLength(1000);
    });

    test("should handle timeout scenarios", async () => {
      const timeoutError = new Error("Request timeout");
      mockFetch.mockRejectedValue(timeoutError);

      const result = await fetchData("https://slow-api.example.com/timeout");

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith("Fetch error:", timeoutError);
    });

    test("should handle various URL formats", async () => {
      const urls = [
        "https://api.example.com",
        "https://api.example.com/",
        "https://api.example.com/v1/restaurants",
        "https://api.example.com/v1/restaurants?limit=10",
        "https://api.example.com/v1/restaurants?limit=10&sort=name",
        "https://subdomain.api.example.com/data",
      ];

      const mockData = { success: true };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      };

      for (const url of urls) {
        mockFetch.mockResolvedValueOnce(mockResponse as any);
        const result = await fetchData(url);
        expect(result).toEqual(mockData);
      }

      expect(mockFetch).toHaveBeenCalledTimes(urls.length);
    });

    test("should handle concurrent requests", async () => {
      const mockData1 = { id: 1, type: "restaurants" };
      const mockData2 = { id: 2, type: "orders" };
      const mockData3 = { id: 3, type: "payments" };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockData1),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockData2),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(mockData3),
        } as any);

      const promises = [
        fetchData("https://api.example.com/restaurants"),
        fetchData("https://api.example.com/orders"),
        fetchData("https://api.example.com/payments"),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([mockData1, mockData2, mockData3]);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    test("should handle mixed success and failure responses", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true }),
        } as any)
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        } as any)
        .mockRejectedValueOnce(new Error("Network error"));

      const results = await Promise.all([
        fetchData("https://api.example.com/success"),
        fetchData("https://api.example.com/not-found"),
        fetchData("https://api.example.com/error"),
      ]);

      expect(results).toEqual([{ success: true }, null, null]);
    });

    test("should handle response with different content types", async () => {
      const testCases = [
        {
          data: { message: "JSON response" },
          expectedResult: { message: "JSON response" },
        },
        { data: [], expectedResult: [] },
        { data: "", expectedResult: "" },
        { data: 0, expectedResult: 0 },
        { data: false, expectedResult: false },
      ];

      for (const testCase of testCases) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue(testCase.data),
        } as any);

        const result = await fetchData("https://api.example.com/test");
        expect(result).toEqual(testCase.expectedResult);
      }
    });
  });
});
