import assert from "node:assert";
import { MediaType } from "../../../dist/index.js";

describe("MediaType.video", () => {
  it("video(string)", () => {
    const i0 = MediaType.video("mp4");
    assert.strictEqual(i0.toString(), "video/mp4");

  });

});
