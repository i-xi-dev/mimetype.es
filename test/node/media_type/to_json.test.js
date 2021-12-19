import assert from "node:assert";
import { MediaType } from "../../../dist/index.js";

describe("MediaType.prototype.toJSON", () => {
  it("toJSON()", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.toJSON(), "text/plain");

    assert.strictEqual(JSON.stringify({x:1,y:i0}), '{"x":1,"y":"text/plain"}');

  });

});
