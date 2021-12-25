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

describe("MediaType.fromString", () => {
  it("fromString(string)", () => {
    expect(MediaType.fromString("text/plain").toString()).toBe("text/plain");
    expect(MediaType.fromString(" text/plain ").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain;").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ;").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; ").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset ").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ").toString()).toBe("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=UTF-8").toString()).toBe("text/plain;charset=UTF-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test").toString()).toBe("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2").toString()).toBe("text/plain;test=test2");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2").toString()).toBe("text/plain;charset=\" utf-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2").toString()).toBe("text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2").toString()).toBe("text/plain;charset=\"ut\\\"f-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2").toString()).toBe("text/plain;charset=\"\\\\\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2").toString()).toBe("text/plain;charset=\" ; test=test2\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2").toString()).toBe("text/plain;charset=\" ; test=test2\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2").toString()).toBe("text/plain;charset=;test=test2");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2').toString()).toBe("text/plain;charset=utf-16;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\").toString()).toBe("text/plain;charset=\"\\\\\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a"').toString()).toBe("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1"').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a').toString()).toBe("text/plain;x=\"http://example.com/x?a=1\";charset=a");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a').toString()).toBe("text/plain;x=\"http://example.com/x?a=1\";charset=a");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis").toString()).toBe("text/plain;charset=utf-8;test=test2");

    expect(() => {
      MediaType.fromString("text/plain,");
    }).toThrowError({
      name: "TypeError",
      message: "subtypeName"
    });

    expect(() => {
      MediaType.fromString(" text/plain ,");
    }).toThrowError({
      name: "TypeError",
      message: "subtypeName"
    });

    expect(MediaType.fromString("text/plain;,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ;,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; ,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset ,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ,").toString()).toBe("text/plain;charset=\"utf-8 ,\"");
    expect(MediaType.fromString("text/plain ;charset=UTF-8,").toString()).toBe("text/plain;charset=\"UTF-8,\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test,").toString()).toBe("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2,").toString()).toBe("text/plain;charset=utf-8;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,").toString()).toBe("text/plain;charset=utf-8;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,").toString()).toBe("text/plain;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,").toString()).toBe("text/plain;charset=\" utf-8\";test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,").toString()).toBe("text/plain;charset=utf-8;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,").toString()).toBe("text/plain;charset=utf-8;test=\"t\\\\est,2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,").toString()).toBe("text/plain;charset=\"ut\\\"f-8\";test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2,").toString()).toBe("text/plain;charset=\"\\\\\";test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,").toString()).toBe("text/plain;charset=\" ; test=test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2,").toString()).toBe("text/plain;charset=\" ; test=test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,").toString()).toBe("text/plain;charset=;test=\"test2,\"");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,').toString()).toBe("text/plain;charset=utf-16;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"\\,").toString()).toBe("text/plain;charset=\",\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",').toString()).toBe("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,').toString()).toBe("text/plain;x=\"http://example.com/x?a=1\";charset=\"a,\"");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,').toString()).toBe("text/plain;x=\"http://example.com/x?a=1\";charset=\"a,\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,").toString()).toBe("text/plain;charset=utf-8;test=test2");

    expect(() => {
      MediaType.fromString("text/plain,%3C");
    }).toThrowError({
      name: "TypeError",
      message: "subtypeName"
    });

    expect(() => {
      MediaType.fromString(" text/plain ,%3C");
    }).toThrowError({
      name: "TypeError",
      message: "subtypeName"
    });

    expect(MediaType.fromString("text/plain;,%3C").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ;,%3C").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; ,%3C").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset,%3C").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset ,%3C").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ,%3C").toString()).toBe("text/plain;charset=\"utf-8 ,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=UTF-8,%3C").toString()).toBe("text/plain;charset=\"UTF-8,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test,%3C").toString()).toBe("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2,%3C").toString()).toBe("text/plain;charset=utf-8;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,%3C").toString()).toBe("text/plain;charset=utf-8;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,%3C").toString()).toBe("text/plain;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,%3C").toString()).toBe("text/plain;charset=\" utf-8\";test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,%3C").toString()).toBe("text/plain;charset=utf-8;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,%3C").toString()).toBe("text/plain;charset=utf-8;test=\"t\\\\est,2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,%3C").toString()).toBe("text/plain;charset=\"ut\\\"f-8\";test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2,%3C").toString()).toBe("text/plain;charset=\"\\\\\";test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,%3C").toString()).toBe("text/plain;charset=\" ; test=test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2,%3C").toString()).toBe("text/plain;charset=\" ; test=test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,%3C").toString()).toBe("text/plain;charset=;test=\"test2,%3C\"");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,%3C').toString()).toBe("text/plain;charset=utf-16;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"\\,%3C").toString()).toBe("text/plain;charset=\",%3C\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",%3C').toString()).toBe("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",%3C').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,%3C').toString()).toBe("text/plain;x=\"http://example.com/x?a=1\";charset=\"a,%3C\"");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,%3C').toString()).toBe("text/plain;x=\"http://example.com/x?a=1\";charset=\"a,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,%3C").toString()).toBe("text/plain;charset=utf-8;test=test2");

    expect(MediaType.fromString("text/plain;base64,").toString()).toBe("text/plain");
    expect(MediaType.fromString(" text/plain ;base64,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain;;base64,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ;;base64,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; ;base64,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset;base64,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset ;base64,").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ;base64,").toString()).toBe("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=UTF-8;base64,").toString()).toBe("text/plain;charset=UTF-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test;base64,").toString()).toBe("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2;base64,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2;base64,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2;base64,").toString()).toBe("text/plain;test=test2");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2;base64,").toString()).toBe("text/plain;charset=\" utf-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2;base64,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2;base64,").toString()).toBe("text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2;base64,").toString()).toBe("text/plain;charset=\"ut\\\"f-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2;base64,").toString()).toBe("text/plain;charset=\"\\\\\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2;base64,").toString()).toBe("text/plain;charset=\" ; test=test2;base64,\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2;base64,").toString()).toBe("text/plain;charset=\" ; test=test2;base64,\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2;base64,").toString()).toBe("text/plain;charset=;test=test2");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2;base64,').toString()).toBe("text/plain;charset=utf-16;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\;base64,").toString()).toBe("text/plain;charset=\";base64,\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a";base64,').toString()).toBe("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1";base64,').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a;base64,').toString()).toBe("text/plain;x=\"http://example.com/x?a=1\";charset=a");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a;base64,').toString()).toBe("text/plain;x=\"http://example.com/x?a=1\";charset=a");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis;base64,").toString()).toBe("text/plain;charset=utf-8;test=test2");

    expect(() => {
      MediaType.fromString("text");
    }).toThrowError({
      name: "TypeError",
      message: "typeName"
    });

    expect(() => {
      MediaType.fromString("text/");
    }).toThrowError({
      name: "TypeError",
      message: "subtypeName"
    });

    expect(() => {
      MediaType.fromString("/test");
    }).toThrowError({
      name: "TypeError",
      message: "typeName"
    });

    expect(() => {
      MediaType.fromString("/");
    }).toThrowError({
      name: "TypeError",
      message: "typeName"
    });

    expect(() => {
      MediaType.fromString("");
    }).toThrowError({
      name: "TypeError",
      message: "typeName"
    });

    expect(() => {
      MediaType.fromString("text/t/t");
    }).toThrowError({
      name: "TypeError",
      message: "subtypeName"
    });

    expect(() => {
      MediaType.fromString("text/t,t");
    }).toThrowError({
      name: "TypeError",
      message: "subtypeName"
    });

  });

});

describe("MediaType.prototype.getParameterValue", () => {
  it("getParameterValue(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.getParameterValue("charset")).toBeNull();

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.getParameterValue("charset")).toBe("uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.getParameterValue("charset")).toBe("uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.getParameterValue("charset")).toBe("uTf-8");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.getParameterValue("charset")).toBe("uTf-8");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.getParameterValue("charset")).toBe("uTf-8 ");

  });

});

describe("MediaType.prototype.hasParameter", () => {
  it("hasParameter(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.hasParameter("charset")).toBe(false);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.hasParameter("charset")).toBe(true);

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.hasParameter("charset")).toBe(true);

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.hasParameter("charset")).toBe(true);

  });

});
