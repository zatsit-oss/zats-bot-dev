const { google } = require("googleapis");
const { saveLinkToSheet } = require("./google-sheet.service");

jest.mock("googleapis", () => ({
  google: {
    auth: {
      getClient: jest.fn(),
    },
    sheets: jest.fn().mockReturnValue({
      spreadsheets: {
        values: {
          get: jest.fn(),
          append: jest.fn(),
        },
        batchUpdate: jest.fn(),
        get: jest.fn(),
      },
    }),
  },
}));

describe("saveLinkToSheet", () => {
  it("should save link to sheet", async () => {
    const auth = { auth: "auth" };
    google.auth.getClient.mockResolvedValue(auth);
    const sheets = google.sheets();
    sheets.spreadsheets.values.get.mockResolvedValue({ data: { values: [] } });
    sheets.spreadsheets.values.append.mockResolvedValue({});
    sheets.spreadsheets.batchUpdate.mockResolvedValue({});
    sheets.spreadsheets.get.mockResolvedValue({
      data: { sheets: [{ properties: { title: "sheetName" } }] },
    });

    await saveLinkToSheet("http://example.com", "user", "label");

    expect(sheets.spreadsheets.values.append).toHaveBeenCalled();
  });

  it("should not save duplicate link", async () => {
    const auth = { auth: "auth" };
    google.auth.getClient.mockResolvedValue(auth);
    const sheets = google.sheets();
    sheets.spreadsheets.values.get.mockResolvedValue({
      data: { values: [["http://example.com"]] },
    });

    const result = await saveLinkToSheet("http://example.com", "user", "label");

    expect(result).toBeNull();
  });
});
