import { MediaType } from "./media_type";

describe("MediaType.prototype.equals", () => {
  it("equals(Object)", () => {
    const i0 = MediaType.fromString("test1/test2;a=x1;b=2;c=3");
    const i1 = MediaType.fromString("test1/test2;b=2;c=3;a=x1");
    const i2 = MediaType.fromString("test2/test2;a=x1;b=2;c=3");
    const i3 = MediaType.fromString("test1/test3;a=x1;b=2;c=3");
    const i4 = MediaType.fromString("test1/test3;a=x2;b=2;c=3");
    const i0b = MediaType.fromString("test1/test2 ;a=x1 ; b=2;c=3");
    const i0c = MediaType.fromString("TEST1/TEST2;A=x1;B=2;C=3");
    const i0d = MediaType.fromString("test1/test2;a=X1;b=2;c=3");
    expect(i0.equals(i0)).toBe(true);
    expect(i0.equals(i1)).toBe(true);
    expect(i0.equals(undefined as unknown as MediaType)).toBe(false);
    expect(i0.equals(i2)).toBe(false);
    expect(i0.equals(i3)).toBe(false);
    expect(i0.equals(i4)).toBe(false);
    expect(i0.equals(i0b)).toBe(true);
    expect(i0.equals(i0c)).toBe(true);
    expect(i0.equals(i0d)).toBe(false);

  });

  it("equals(Object, Object)", () => {
    const op = {caseInsensitiveParameters:["a"]};

    const i0 = MediaType.fromString("test1/test2;a=x1;b=2;c=3");
    const i1 = MediaType.fromString("test1/test2;b=2;c=3;a=x1");
    const i2 = MediaType.fromString("test2/test2;a=x1;b=2;c=3");
    const i3 = MediaType.fromString("test1/test3;a=x1;b=2;c=3");
    const i4 = MediaType.fromString("test1/test3;a=x2;b=2;c=3");
    const i0b = MediaType.fromString("test1/test2 ;a=x1 ; b=2;c=3");
    const i0c = MediaType.fromString("TEST1/TEST2;A=x1;B=2;C=3");
    const i0d = MediaType.fromString("test1/test2;a=X1;b=2;c=3");
    expect(i0.equals(i0, op)).toBe(true);
    expect(i0.equals(i1, op)).toBe(true);
    expect(i0.equals(undefined, op)).toBe(false);
    expect(i0.equals(i2, op)).toBe(false);
    expect(i0.equals(i3, op)).toBe(false);
    expect(i0.equals(i4, op)).toBe(false);
    expect(i0.equals(i0b, op)).toBe(true);
    expect(i0.equals(i0c, op)).toBe(true);
    expect(i0.equals(i0d, op)).toBe(true);

  });

});

describe("MediaType.prototype.essence", () => {
  it("essence", () => {
    const i0 = MediaType.fromString("text/plain;charset=utf-8");
    expect(i0.essence).toBe("text/plain");

  });

});
