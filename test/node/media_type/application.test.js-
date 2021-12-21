import assert from "node:assert";
import { MediaType } from "../../../dist/index.js";

describe("MediaType.application", () => {
  it("application(string)", () => {
    const i0 = MediaType.application("octet-stream");
    assert.strictEqual(i0.toString(), "application/octet-stream");

    const i1 = MediaType.application("octet-Stream");
    assert.strictEqual(i1.toString(), "application/octet-stream");

  });

  it("application(string, Array)", () => {
    const i0 = MediaType.application("xhtml+xml", [["charset", "utf-8"]]);
    assert.strictEqual(i0.toString(), "application/xhtml+xml;charset=utf-8");

    const i1 = MediaType.application("soap+xml", [["charset", "utf-8"],["action", "https://example.com/action"]]);
    assert.strictEqual(i1.toString(), "application/soap+xml;charset=utf-8;action=\"https://example.com/action\"");

  });

});
