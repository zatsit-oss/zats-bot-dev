const { paramsValidator } = require("./params.validator");

describe("paramsValidator", () => {
  it("should return false if message is missing", () => {
    const params = {};
    expect(paramsValidator(params)).toBe(false);
  });

  it("should return false if message.text is missing", () => {
    const params = { message: {} };
    expect(paramsValidator(params)).toBe(false);
  });

  it("should return false if message.sender is missing", () => {
    const params = { message: { text: "text" } };
    expect(paramsValidator(params)).toBe(false);
  });

  it("should return false if message.sender.displayName is missing", () => {
    const params = { message: { text: "text", sender: {} } };
    expect(paramsValidator(params)).toBe(false);
  });

  it("should return true if all required fields are present", () => {
    const params = {
      message: { text: "text", sender: { displayName: "name" } },
    };
    expect(paramsValidator(params)).toBe(true);
  });
});
