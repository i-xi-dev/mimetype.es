import assert from "node:assert";
import { MediaType } from "../../../dist/index.js";

describe("MediaType.audio", () => {
  it("audio(string)", () => {
    const i0 = MediaType.audio("ogg");
    assert.strictEqual(i0.toString(), "audio/ogg");

  });

});
