import { assertStrictEquals, assertThrows } from "std/testing/asserts";
import { MediaType } from "../mod.ts";

Deno.test("MediaType.prototype.equals(Object)", () => {
  const i0A = MediaType.fromString("test1/test2;a=x1;b=2;c=3");
  const i1A = MediaType.fromString("test1/test2;b=2;c=3;a=x1");
  const i2A = MediaType.fromString("test2/test2;a=x1;b=2;c=3");
  const i3A = MediaType.fromString("test1/test3;a=x1;b=2;c=3");
  const i4A = MediaType.fromString("test1/test3;a=x2;b=2;c=3");
  const i0Ab = MediaType.fromString("test1/test2 ;a=x1 ; b=2;c=3");
  const i0Ac = MediaType.fromString("TEST1/TEST2;A=x1;B=2;C=3");
  const i0Ad = MediaType.fromString("test1/test2;a=X1;b=2;c=3");
  assertStrictEquals(i0A.equals(i0A), true);
  assertStrictEquals(i0A.equals(i1A), true);
  assertStrictEquals(i0A.equals(undefined as unknown as MediaType), false);
  assertStrictEquals(i0A.equals(i2A), false);
  assertStrictEquals(i0A.equals(i3A), false);
  assertStrictEquals(i0A.equals(i4A), false);
  assertStrictEquals(i0A.equals(i0Ab), true);
  assertStrictEquals(i0A.equals(i0Ac), true);
  assertStrictEquals(i0A.equals(i0Ad), false);
});

Deno.test("MediaType.prototype.equals(Object, Object)", () => {
  const opB = { caseInsensitiveParameters: ["a"] };

  const i0B = MediaType.fromString("test1/test2;a=x1;b=2;c=3");
  const i1B = MediaType.fromString("test1/test2;b=2;c=3;a=x1");
  const i2B = MediaType.fromString("test2/test2;a=x1;b=2;c=3");
  const i3B = MediaType.fromString("test1/test3;a=x1;b=2;c=3");
  const i4B = MediaType.fromString("test1/test3;a=x2;b=2;c=3");
  const i0Bb = MediaType.fromString("test1/test2 ;a=x1 ; b=2;c=3");
  const i0Bc = MediaType.fromString("TEST1/TEST2;A=x1;B=2;C=3");
  const i0Bd = MediaType.fromString("test1/test2;a=X1;b=2;c=3");
  assertStrictEquals(i0B.equals(i0B, opB), true);
  assertStrictEquals(i0B.equals(i1B, opB), true);
  assertStrictEquals(i0B.equals(undefined as unknown as MediaType, opB), false);
  assertStrictEquals(i0B.equals(i2B, opB), false);
  assertStrictEquals(i0B.equals(i3B, opB), false);
  assertStrictEquals(i0B.equals(i4B, opB), false);
  assertStrictEquals(i0B.equals(i0Bb, opB), true);
  assertStrictEquals(i0B.equals(i0Bc, opB), true);
  assertStrictEquals(i0B.equals(i0Bd, opB), true);
});

Deno.test("MediaType.prototype.essence", () => {
  const i0 = MediaType.fromString("text/plain;charset=utf-8");
  assertStrictEquals(i0.essence, "text/plain");
});

Deno.test("MediaType.fromString(string)", () => {
  assertStrictEquals(
    MediaType.fromString("text/plain").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString(" text/plain ").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain;").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; ").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset ").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset=utf-8 ").toString(),
    "text/plain;charset=utf-8",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=UTF-8").toString(),
    "text/plain;charset=UTF-8",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8;test").toString(),
    "text/plain;charset=utf-8",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8; test=test2").toString(),
    "text/plain;charset=utf-8;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8 ; test=test2").toString(),
    "text/plain;charset=utf-8;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset =utf-8 ; test=test2").toString(),
    "text/plain;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset= utf-8 ; test=test2").toString(),
    'text/plain;charset=" utf-8";test=test2',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="utf-8" ; test=test2').toString(),
    "text/plain;charset=utf-8;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="ut\\f-8" ; test=t\\est,2')
      .toString(),
    'text/plain;charset=utf-8;test="t\\\\est,2"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="ut\\"f-8" ; test=test2')
      .toString(),
    'text/plain;charset="ut\\"f-8";test=test2',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=\\ ; test=test2").toString(),
    'text/plain;charset="\\\\";test=test2',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="\\ ; test=test2').toString(),
    'text/plain;charset=" ; test=test2"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset=" ; test=test2').toString(),
    'text/plain;charset=" ; test=test2"',
  );

  //TODO
  const xx = MediaType.fromString('text/plain ;charset="" ; test=test2');
  console.log([...xx.parameters()]);

  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="" ; test=test2').toString(),
    "text/plain;charset=;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2')
      .toString(),
    "text/plain;charset=utf-16;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="\\').toString(),
    'text/plain;charset="\\\\"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="aa\\\\a\\"a"').toString(),
    'text/plain;charset="aa\\\\a\\"a"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1"')
      .toString(),
    'text/plain;charset=a;x="http://example.com/x?a=1"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a')
      .toString(),
    'text/plain;x="http://example.com/x?a=1";charset=a',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a')
      .toString(),
    'text/plain;x="http://example.com/x?a=1";charset=a',
  );
  assertStrictEquals(
    MediaType.fromString(
      "text/plain ;charset=utf-8;test=test2;charset=shift_jis",
    ).toString(),
    "text/plain;charset=utf-8;test=test2",
  );

  assertThrows(
    () => {
      MediaType.fromString("text/plain,");
    },
    TypeError,
    "subtypeName",
  );

  assertThrows(
    () => {
      MediaType.fromString(" text/plain ,");
    },
    TypeError,
    "subtypeName",
  );

  assertStrictEquals(
    MediaType.fromString("text/plain;,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; ,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset ,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset= ;p2=3").toString(),
    "text/plain;p2=3",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; p1=1;=3;p3=4").toString(),
    "text/plain;p1=1;p3=4",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; p1=1;p2=あ;p3=4").toString(),
    "text/plain;p1=1;p3=4",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset=utf-8 ,").toString(),
    'text/plain;charset="utf-8 ,"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=UTF-8,").toString(),
    'text/plain;charset="UTF-8,"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8;test,").toString(),
    "text/plain;charset=utf-8",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8; test=test2,").toString(),
    'text/plain;charset=utf-8;test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,").toString(),
    'text/plain;charset=utf-8;test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,").toString(),
    'text/plain;test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,").toString(),
    'text/plain;charset=" utf-8";test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="utf-8" ; test=test2,')
      .toString(),
    'text/plain;charset=utf-8;test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="ut\\f-8" ; test=t\\est,2,')
      .toString(),
    'text/plain;charset=utf-8;test="t\\\\est,2,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="ut\\"f-8" ; test=test2,')
      .toString(),
    'text/plain;charset="ut\\"f-8";test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=\\ ; test=test2,").toString(),
    'text/plain;charset="\\\\";test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="\\ ; test=test2,').toString(),
    'text/plain;charset=" ; test=test2,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset=" ; test=test2,').toString(),
    'text/plain;charset=" ; test=test2,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="" ; test=test2,').toString(),
    'text/plain;charset=;test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,')
      .toString(),
    'text/plain;charset=utf-16;test="test2,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="\\,').toString(),
    'text/plain;charset=","',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",').toString(),
    'text/plain;charset="aa\\\\a\\"a"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",')
      .toString(),
    'text/plain;charset=a;x="http://example.com/x?a=1"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,')
      .toString(),
    'text/plain;x="http://example.com/x?a=1";charset="a,"',
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ; x="http://example.com/x?a=1" ;charset=a,',
    ).toString(),
    'text/plain;x="http://example.com/x?a=1";charset="a,"',
  );
  assertStrictEquals(
    MediaType.fromString(
      "text/plain ;charset=utf-8;test=test2;charset=shift_jis,",
    ).toString(),
    "text/plain;charset=utf-8;test=test2",
  );

  assertThrows(
    () => {
      MediaType.fromString("text/plain,%3C");
    },
    TypeError,
    "subtypeName",
  );

  assertThrows(
    () => {
      MediaType.fromString(" text/plain ,%3C");
    },
    TypeError,
    "subtypeName",
  );

  assertStrictEquals(
    MediaType.fromString("text/plain;,%3C").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;,%3C").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; ,%3C").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset,%3C").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset ,%3C").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset=utf-8 ,%3C").toString(),
    'text/plain;charset="utf-8 ,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=UTF-8,%3C").toString(),
    'text/plain;charset="UTF-8,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8;test,%3C").toString(),
    "text/plain;charset=utf-8",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8; test=test2,%3C")
      .toString(),
    'text/plain;charset=utf-8;test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,%3C")
      .toString(),
    'text/plain;charset=utf-8;test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,%3C")
      .toString(),
    'text/plain;test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,%3C")
      .toString(),
    'text/plain;charset=" utf-8";test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="utf-8" ; test=test2,%3C')
      .toString(),
    'text/plain;charset=utf-8;test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="ut\\f-8" ; test=t\\est,2,%3C')
      .toString(),
    'text/plain;charset=utf-8;test="t\\\\est,2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="ut\\"f-8" ; test=test2,%3C')
      .toString(),
    'text/plain;charset="ut\\"f-8";test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=\\ ; test=test2,%3C").toString(),
    'text/plain;charset="\\\\";test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="\\ ; test=test2,%3C').toString(),
    'text/plain;charset=" ; test=test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset=" ; test=test2,%3C').toString(),
    'text/plain;charset=" ; test=test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="" ; test=test2,%3C').toString(),
    'text/plain;charset=;test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,%3C')
      .toString(),
    'text/plain;charset=utf-16;test="test2,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="\\,%3C').toString(),
    'text/plain;charset=",%3C"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",%3C').toString(),
    'text/plain;charset="aa\\\\a\\"a"',
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ;charset=a;x="http://example.com/x?a=1",%3C',
    ).toString(),
    'text/plain;charset=a;x="http://example.com/x?a=1"',
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ;x="http://example.com/x?a=1";charset=a,%3C',
    ).toString(),
    'text/plain;x="http://example.com/x?a=1";charset="a,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ; x="http://example.com/x?a=1" ;charset=a,%3C',
    ).toString(),
    'text/plain;x="http://example.com/x?a=1";charset="a,%3C"',
  );
  assertStrictEquals(
    MediaType.fromString(
      "text/plain ;charset=utf-8;test=test2;charset=shift_jis,%3C",
    ).toString(),
    "text/plain;charset=utf-8;test=test2",
  );

  assertStrictEquals(
    MediaType.fromString("text/plain;base64,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString(" text/plain ;base64,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain;;base64,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;;base64,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; ;base64,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset;base64,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset ;base64,").toString(),
    "text/plain",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ; charset=utf-8 ;base64,").toString(),
    "text/plain;charset=utf-8",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=UTF-8;base64,").toString(),
    "text/plain;charset=UTF-8",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8;test;base64,").toString(),
    "text/plain;charset=utf-8",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8; test=test2;base64,")
      .toString(),
    "text/plain;charset=utf-8;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=utf-8 ; test=test2;base64,")
      .toString(),
    "text/plain;charset=utf-8;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset =utf-8 ; test=test2;base64,")
      .toString(),
    "text/plain;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset= utf-8 ; test=test2;base64,")
      .toString(),
    'text/plain;charset=" utf-8";test=test2',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="utf-8" ; test=test2;base64,')
      .toString(),
    "text/plain;charset=utf-8;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ;charset="ut\\f-8" ; test=t\\est,2;base64,',
    ).toString(),
    'text/plain;charset=utf-8;test="t\\\\est,2"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="ut\\"f-8" ; test=test2;base64,')
      .toString(),
    'text/plain;charset="ut\\"f-8";test=test2',
  );
  assertStrictEquals(
    MediaType.fromString("text/plain ;charset=\\ ; test=test2;base64,")
      .toString(),
    'text/plain;charset="\\\\";test=test2',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="\\ ; test=test2;base64,')
      .toString(),
    'text/plain;charset=" ; test=test2;base64,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset=" ; test=test2;base64,')
      .toString(),
    'text/plain;charset=" ; test=test2;base64,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="" ; test=test2;base64,')
      .toString(),
    "text/plain;charset=;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ;charset="utf-16" utf-8 ; test=test2;base64,',
    ).toString(),
    "text/plain;charset=utf-16;test=test2",
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="\\;base64,').toString(),
    'text/plain;charset=";base64,"',
  );
  assertStrictEquals(
    MediaType.fromString('text/plain ;charset="aa\\\\a\\"a";base64,')
      .toString(),
    'text/plain;charset="aa\\\\a\\"a"',
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ;charset=a;x="http://example.com/x?a=1";base64,',
    ).toString(),
    'text/plain;charset=a;x="http://example.com/x?a=1"',
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ;x="http://example.com/x?a=1";charset=a;base64,',
    ).toString(),
    'text/plain;x="http://example.com/x?a=1";charset=a',
  );
  assertStrictEquals(
    MediaType.fromString(
      'text/plain ; x="http://example.com/x?a=1" ;charset=a;base64,',
    ).toString(),
    'text/plain;x="http://example.com/x?a=1";charset=a',
  );
  assertStrictEquals(
    MediaType.fromString(
      "text/plain ;charset=utf-8;test=test2;charset=shift_jis;base64,",
    ).toString(),
    "text/plain;charset=utf-8;test=test2",
  );

  assertThrows(
    () => {
      MediaType.fromString("text");
    },
    TypeError,
    "typeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("あ");
    },
    TypeError,
    "typeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("あ/");
    },
    TypeError,
    "typeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("text/");
    },
    TypeError,
    "subtypeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("text/;");
    },
    TypeError,
    "subtypeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("/test");
    },
    TypeError,
    "typeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("/");
    },
    TypeError,
    "typeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("");
    },
    TypeError,
    "typeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("text/t/t");
    },
    TypeError,
    "subtypeName",
  );

  assertThrows(
    () => {
      MediaType.fromString("text/t,t");
    },
    TypeError,
    "subtypeName",
  );
});

Deno.test("MediaType.prototype.getParameterValue(string)", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.getParameterValue("charset"), null);

  const i1 = MediaType.fromString("text/plain;charset=uTf-8");
  assertStrictEquals(i1.getParameterValue("charset"), "uTf-8");

  const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
  assertStrictEquals(i2.getParameterValue("charset"), "uTf-8");

  const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
  assertStrictEquals(i3.getParameterValue("charset"), "uTf-8");

  const i4 = MediaType.fromString('text/plain;charset="uTf-8" ; x=9');
  assertStrictEquals(i4.getParameterValue("charset"), "uTf-8");

  const i5 = MediaType.fromString('text/plain;  charset="uTf-8 "; x=9');
  assertStrictEquals(i5.getParameterValue("charset"), "uTf-8 ");
});

Deno.test("MediaType.prototype.hasParameter(string)", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.hasParameter("charset"), false);

  const i1 = MediaType.fromString("text/plain;charset=uTf-8");
  assertStrictEquals(i1.hasParameter("charset"), true);

  const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
  assertStrictEquals(i2.hasParameter("charset"), true);

  const i5 = MediaType.fromString('text/plain;  charset="uTf-8 "; x=9');
  assertStrictEquals(i5.hasParameter("charset"), true);
});

Deno.test("MediaType.prototype.originalString", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.originalString, "text/plain");

  const i0b = MediaType.fromString("text/plain ");
  assertStrictEquals(i0b.originalString, "text/plain");

  const i0c = MediaType.fromString("text/plain; charset=Utf-8  ");
  assertStrictEquals(i0c.originalString, "text/plain; charset=Utf-8");
  assertStrictEquals(i0c.toString(), "text/plain;charset=Utf-8");
  assertStrictEquals(
    i0c.withParameters([["charset", "utf-8"]]).originalString,
    "text/plain;charset=utf-8",
  );
});

Deno.test("MediaType.prototype.parameterNames()", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(JSON.stringify([...i0.parameterNames()]), "[]");

  const i0b = MediaType.fromString("text/plain;charset=utf-8");
  assertStrictEquals(JSON.stringify([...i0b.parameterNames()]), '["charset"]');

  const i0c = MediaType.fromString("text/plain;charset=utf-8; a=,");
  assertStrictEquals(
    JSON.stringify([...i0c.parameterNames()]),
    '["charset","a"]',
  );

  let i = 0;
  for (const p of i0c.parameterNames()) {
    if (i === 0) {
      assertStrictEquals(JSON.stringify(p), '"charset"');
    } else if (i === 1) {
      assertStrictEquals(JSON.stringify(p), '"a"');
    }

    i++;
  }
  assertStrictEquals(i, 2);
});

Deno.test("MediaType.prototype.parameters()", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(JSON.stringify([...i0.parameters()]), "[]");

  const i0b = MediaType.fromString("text/plain;charset=utf-8");
  assertStrictEquals(
    JSON.stringify([...i0b.parameters()]),
    '[["charset","utf-8"]]',
  );

  const i0c = MediaType.fromString("text/plain;charset=utf-8; a=,");
  assertStrictEquals(
    JSON.stringify([...i0c.parameters()]),
    '[["charset","utf-8"],["a",","]]',
  );

  let i = 0;
  for (const p of i0c.parameters()) {
    if (i === 0) {
      assertStrictEquals(JSON.stringify(p), '["charset","utf-8"]');
    } else if (i === 1) {
      assertStrictEquals(JSON.stringify(p), '["a",","]');
    }

    i++;
  }
  assertStrictEquals(i, 2);
});

Deno.test("MediaType.prototype.subtype", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.subtype, "plain");

  const i0b = MediaType.fromString("text/PLAIN");
  assertStrictEquals(i0b.subtype, "plain");

  const i0c = MediaType.fromString("image/svg+xml");
  assertStrictEquals(i0c.subtype, "svg+xml");
});

Deno.test("MediaType.prototype.suffix", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.suffix, "");

  const i0b = MediaType.fromString("text/PLAIN");
  assertStrictEquals(i0b.suffix, "");

  const i0c = MediaType.fromString("image/svg+xml");
  assertStrictEquals(i0c.suffix, "+xml");

  const i0d = MediaType.fromString("example/aaa+bbb+ccc");
  assertStrictEquals(i0d.suffix, "+ccc");
});

Deno.test("MediaType.prototype.toJSON()", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.toJSON(), "text/plain");

  assertStrictEquals(
    JSON.stringify({ x: 1, y: i0 }),
    '{"x":1,"y":"text/plain"}',
  );
});

Deno.test("MediaType.prototype.toString()", () => {
  const i0 = MediaType.fromString("text/PLAIN");
  assertStrictEquals(i0.toString(), "text/plain");

  const i1 = MediaType.fromString("text/plain;charset=uTf-8");
  assertStrictEquals(i1.toString(), "text/plain;charset=uTf-8");

  const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
  assertStrictEquals(i2.toString(), "text/plain;charset=uTf-8");

  const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
  assertStrictEquals(i3.toString(), "text/plain;charset=uTf-8;x=9");

  const i4 = MediaType.fromString('text/plain;charset="uTf-8" ; x=9');
  assertStrictEquals(i4.toString(), "text/plain;charset=uTf-8;x=9");

  const i5 = MediaType.fromString('text/plain;  charset="uTf-8 "; x=9');
  assertStrictEquals(i5.toString(), 'text/plain;charset="uTf-8 ";x=9');

  const i6 = MediaType.fromString("text/plain;y=7; charset=uTf-8 ; x=9");
  assertStrictEquals(i6.toString(), "text/plain;y=7;charset=uTf-8;x=9");
});

Deno.test("MediaType.prototype.type", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.type, "text");
});

Deno.test("MediaType.prototype.withParameters(Array)", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.withParameters([]).toString(), "text/plain");

  const i1 = MediaType.fromString("text/plain;charset=uTf-8");
  assertStrictEquals(i1.withParameters([]).toString(), "text/plain");

  const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
  assertStrictEquals(i2.withParameters([]).toString(), "text/plain");

  const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
  assertStrictEquals(i3.withParameters([]).toString(), "text/plain");

  const i4 = MediaType.fromString('text/plain;charset="uTf-8" ; x=9');
  assertStrictEquals(i4.withParameters([]).toString(), "text/plain");

  const i5 = MediaType.fromString('text/plain;  charset="uTf-8 "; x=9');
  assertStrictEquals(i5.withParameters([]).toString(), "text/plain");

  const i6 = MediaType.fromString('text/plain;  charset="uTf-8 "; x=9');
  assertStrictEquals(
    i6.withParameters([["hoge", "http://"], ["charset", "utf-16be"]])
      .toString(),
    'text/plain;hoge="http://";charset=utf-16be',
  );
  assertStrictEquals(i6.toString(), 'text/plain;charset="uTf-8 ";x=9');

  const i7 = MediaType.fromString("text/plain");
  assertThrows(
    () => {
      i7.withParameters([["a", "1"], ["a", "2"]]);
    },
    TypeError,
    "parameters",
  );
});

Deno.test("MediaType.prototype.withoutParameters()", () => {
  const i0 = MediaType.fromString("text/plain");
  assertStrictEquals(i0.withoutParameters().toString(), "text/plain");

  const i1 = MediaType.fromString("text/plain;charset=uTf-8");
  assertStrictEquals(i1.withoutParameters().toString(), "text/plain");

  const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
  assertStrictEquals(i2.withoutParameters().toString(), "text/plain");

  const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
  assertStrictEquals(i3.withoutParameters().toString(), "text/plain");

  const i4 = MediaType.fromString('text/plain;charset="uTf-8" ; x=9');
  assertStrictEquals(i4.withoutParameters().toString(), "text/plain");

  const i5 = MediaType.fromString('text/plain;  charset="uTf-8 "; x=9');
  assertStrictEquals(i5.withoutParameters().toString(), "text/plain");
  assertStrictEquals(i5.toString(), 'text/plain;charset="uTf-8 ";x=9');
});

Deno.test("MediaType.fromHeaders(Headers)", () => {
  const h1 = new Headers({ "content-type": "text/plain" });
  const i1 = MediaType.fromHeaders(h1);
  assertStrictEquals(i1.toString(), "text/plain");

  const h2 = new Headers();
  h2.append("content-type", "text/plain");
  const i2 = MediaType.fromHeaders(h2);
  assertStrictEquals(i2.toString(), "text/plain");
  h2.append("content-type", "text/html");
  const i2b = MediaType.fromHeaders(h2);
  assertStrictEquals(i2b.toString(), "text/html");

  const h3 = new Headers();
  assertThrows(
    () => {
      MediaType.fromHeaders(h3);
    },
    Error,
    "Content-Type field not found",
  );

  const h4 = new Headers({ "content-type": "" });
  assertThrows(
    () => {
      MediaType.fromHeaders(h4);
    },
    Error,
    "Content-Type value not found",
  );
});
