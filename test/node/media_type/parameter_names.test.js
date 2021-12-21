import assert from "node:assert";
import { MediaType } from "../../../dist/index.js";

describe("MediaType.prototype.parameterNames", () => {
  it("parameterNames()", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(JSON.stringify([...i0.parameterNames()]), "[]");

    const i0b = MediaType.fromString("text/plain;charset=utf-8");
    assert.strictEqual(JSON.stringify([...i0b.parameterNames()]), '["charset"]');

    const i0c = MediaType.fromString("text/plain;charset=utf-8; a=,");
    assert.strictEqual(JSON.stringify([...i0c.parameterNames()]), '["charset","a"]');

    let i = 0;
    for (const p of i0c.parameterNames()) {
      if (i === 0) {
        assert.strictEqual(JSON.stringify(p), '"charset"');
      }
      else if (i === 1) {
        assert.strictEqual(JSON.stringify(p), '"a"');
      }

      i++;
    }

  });

});
