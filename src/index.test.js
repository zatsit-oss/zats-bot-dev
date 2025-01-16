const { handler } = require("./index");
const { addLink } = require("./controllers/add-link.controller");
const { paramsValidator } = require("./utils/params.validator");

jest.mock("./controllers/add-link.controller");
jest.mock("./utils/params.validator");

describe("handler", () => {
  it("should return error message for invalid params", async () => {
    paramsValidator.mockReturnValue(false);
    const req = { body: {} };
    const res = { json: jest.fn() };

    await handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      text: "❌ Requête invalide. Veuillez vérifier les données envoyées.",
    });
  });

  it("should return error message for unrecognized command", async () => {
    paramsValidator.mockReturnValue(true);
    const req = { body: { message: { text: "/invalidCommand" } } };
    const res = { json: jest.fn() };

    await handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      text: "❌ commande non reconnu",
    });
  });

  it("should call addLink for /addLink command", async () => {
    paramsValidator.mockReturnValue(true);
    addLink.mockResolvedValue({ text: "success" });
    const req = {
      body: { message: { text: "/addLink https://example.com label" } },
    };
    const res = { json: jest.fn() };

    await handler(req, res);

    expect(addLink).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith({ text: "success" });
  });
});
