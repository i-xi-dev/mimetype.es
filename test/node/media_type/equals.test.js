import assert from "node:assert";
import { MediaType } from "../../../dist/index.js";

describe("MediaType.prototype.equals", () => {
  it("equals(Object)", () => {
    const i0 = MediaType.fromString("test1/test2;a=1;b=2;c=3");
    const i1 = MediaType.fromString("test1/test2;b=2;c=3;a=1");
    const i2 = MediaType.fromString("test2/test2;a=1;b=2;c=3");
    const i3 = MediaType.fromString("test1/test3;a=1;b=2;c=3");
    const i4 = MediaType.fromString("test1/test3;a=2;b=2;c=3");
    const i0b = MediaType.fromString("test1/test2 ;a=1 ; b=2;c=3");
    assert.strictEqual(i0.equals(i0), true);
    assert.strictEqual(i0.equals(i1), true);
    assert.strictEqual(i0.equals(), false);
    assert.strictEqual(i0.equals(i2), false);
    assert.strictEqual(i0.equals(i3), false);
    assert.strictEqual(i0.equals(i4), false);
    assert.strictEqual(i0.equals(i0b), true);

  });

});
