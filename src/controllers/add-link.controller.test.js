const { addLink } = require("./add-link.controller");
const { saveLinkToSheet } = require("../services/google-sheet.service");
const { checkUrl } = require("../services/url.service");

jest.mock("../services/google-sheet.service");
jest.mock("../services/url.service");

describe("addLink", () => {
  it("should return error message for invalid command", async () => {
    const params = {
      message: { text: "/invalidCommand", sender: { displayName: "user" } },
    };
    const result = await addLink(params);
    expect(result.text).toBe(
      "❌ Utilisez la commande /addLink pour enregistrer un lien."
    );
  });

  it("should return error message for missing URL or label", async () => {
    const params = {
      message: { text: "/addLink", sender: { displayName: "user" } },
    };
    const result = await addLink(params);
    expect(result.text).toBe("🚨 Utilisation : /addLink [URL] [label] ");
  });

  it("should return error message for invalid URL", async () => {
    const params = {
      message: {
        text: "/addLink invalid-url label",
        sender: { displayName: "user" },
      },
    };
    const result = await addLink(params);
    expect(result.text).toBe(
      " ❌ URL invalide: invalid-url, utilisation : /addLink [URL] [label]"
    );
  });

  it("should return error message for unreachable URL", async () => {
    checkUrl.mockResolvedValue(false);
    const params = {
      message: {
        text: "/addLink https://example.com label",
        sender: { displayName: "user" },
      },
    };
    const result = await addLink(params);
    expect(result.text).toBe("L'URL est injoignable ou retourne une erreur");
  });

  it("should return success message for valid URL", async () => {
    checkUrl.mockResolvedValue(true);
    saveLinkToSheet.mockResolvedValue({});
    const params = {
      message: {
        text: "/addLink https://example.com label",
        sender: { displayName: "user" },
      },
    };
    const result = await addLink(params);
    expect(result.text).toBe(
      "✅ Lien ajouté avec succès : https://example.com"
    );
  });

  it("should return error message for duplicate URL", async () => {
    checkUrl.mockResolvedValue(true);
    saveLinkToSheet.mockResolvedValue(null);
    const params = {
      message: {
        text: "/addLink https://example.com label",
        sender: { displayName: "user" },
      },
    };
    const result = await addLink(params);
    expect(result.text).toBe("🚨 Lien déjà présent");
  });
});
