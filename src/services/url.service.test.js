const axios = require("axios");
const { checkUrl } = require("./url.service");

jest.mock("axios");

describe("checkUrl", () => {
  it("should return false for http URLs", async () => {
    const result = await checkUrl("http://example.com");
    expect(result).toBe(false);
  });

  it("should return true for valid https URLs", async () => {
    axios.get.mockResolvedValue({ status: 200 });
    const result = await checkUrl("https://example.com");
    expect(result).toBe(true);
  });

  it("should return false for invalid URLs", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));
    const result = await checkUrl("https://invalid-url.com");
    expect(result).toBe(false);
  });
});
