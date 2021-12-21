import assert from "node:assert";
import { MediaType } from "../../../dist/index.js";

describe("MediaType.text", () => {
  it("text(string)", () => {
    const i0 = MediaType.text("plain");
    assert.strictEqual(i0.toString(), "text/plain");

  });

});
