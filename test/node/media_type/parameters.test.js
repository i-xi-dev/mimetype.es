import assert from "node:assert";
import { MediaType } from "../../../dist/index.js";

describe("MediaType.prototype.parameters", () => {
  it("parameters()", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(JSON.stringify([...i0.parameters()]), "[]");

    const i0b = MediaType.fromString("text/plain;charset=utf-8");
    assert.strictEqual(JSON.stringify([...i0b.parameters()]), '[["charset","utf-8"]]');

    const i0c = MediaType.fromString("text/plain;charset=utf-8; a=,");
    assert.strictEqual(JSON.stringify([...i0c.parameters()]), '[["charset","utf-8"],["a",","]]');

    let i = 0;
    for (const p of i0c.parameters()) {
      if (i === 0) {
        assert.strictEqual(JSON.stringify(p), '["charset","utf-8"]');
      }
      else if (i === 1) {
        assert.strictEqual(JSON.stringify(p), '["a",","]');
      }

      i++;
    }

  });

});
