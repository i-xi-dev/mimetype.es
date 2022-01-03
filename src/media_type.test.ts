import assert from "node:assert";
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
    assert.strictEqual(i0.equals(i0), true);
    assert.strictEqual(i0.equals(i1), true);
    assert.strictEqual(i0.equals(undefined as unknown as MediaType), false);
    assert.strictEqual(i0.equals(i2), false);
    assert.strictEqual(i0.equals(i3), false);
    assert.strictEqual(i0.equals(i4), false);
    assert.strictEqual(i0.equals(i0b), true);
    assert.strictEqual(i0.equals(i0c), true);
    assert.strictEqual(i0.equals(i0d), false);

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
    assert.strictEqual(i0.equals(i0, op), true);
    assert.strictEqual(i0.equals(i1, op), true);
    assert.strictEqual(i0.equals(undefined as unknown as MediaType, op), false);
    assert.strictEqual(i0.equals(i2, op), false);
    assert.strictEqual(i0.equals(i3, op), false);
    assert.strictEqual(i0.equals(i4, op), false);
    assert.strictEqual(i0.equals(i0b, op), true);
    assert.strictEqual(i0.equals(i0c, op), true);
    assert.strictEqual(i0.equals(i0d, op), true);

  });

});

describe("MediaType.prototype.essence", () => {
  it("essence", () => {
    const i0 = MediaType.fromString("text/plain;charset=utf-8");
    assert.strictEqual(i0.essence, "text/plain");

  });

});

describe("MediaType.fromString", () => {
  it("fromString(string)", () => {
    assert.strictEqual(MediaType.fromString("text/plain").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString(" text/plain ").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain;").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ;").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; ").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset ").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset=utf-8 ").toString(), "text/plain;charset=utf-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=UTF-8").toString(), "text/plain;charset=UTF-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test").toString(), "text/plain;charset=utf-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8; test=test2").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2").toString(), "text/plain;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2").toString(), "text/plain;charset=\" utf-8\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2").toString(), "text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2").toString(), "text/plain;charset=\"ut\\\"f-8\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\\ ; test=test2").toString(), "text/plain;charset=\"\\\\\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2").toString(), "text/plain;charset=\" ; test=test2\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\" ; test=test2").toString(), "text/plain;charset=\" ; test=test2\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\" ; test=test2").toString(), "text/plain;charset=;test=test2");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2').toString(), "text/plain;charset=utf-16;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\").toString(), "text/plain;charset=\"\\\\\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a"').toString(), "text/plain;charset=\"aa\\\\a\\\"a\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1"').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    assert.strictEqual(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a').toString(), "text/plain;x=\"http://example.com/x?a=1\";charset=a");
    assert.strictEqual(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a').toString(), "text/plain;x=\"http://example.com/x?a=1\";charset=a");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis").toString(), "text/plain;charset=utf-8;test=test2");

    assert.throws(() => {
      MediaType.fromString("text/plain,");
    }, {
      name: "TypeError",
      message: "subtypeName"
    });

    assert.throws(() => {
      MediaType.fromString(" text/plain ,");
    }, {
      name: "TypeError",
      message: "subtypeName"
    });

    assert.strictEqual(MediaType.fromString("text/plain;,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ;,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; ,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset ,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset= ;p2=3").toString(), "text/plain;p2=3");
    assert.strictEqual(MediaType.fromString("text/plain ; p1=1;=3;p3=4").toString(), "text/plain;p1=1;p3=4");
    assert.strictEqual(MediaType.fromString("text/plain ; p1=1;p2=あ;p3=4").toString(), "text/plain;p1=1;p3=4");
    assert.strictEqual(MediaType.fromString("text/plain ; charset=utf-8 ,").toString(), "text/plain;charset=\"utf-8 ,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=UTF-8,").toString(), "text/plain;charset=\"UTF-8,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test,").toString(), "text/plain;charset=utf-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8; test=test2,").toString(), "text/plain;charset=utf-8;test=\"test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,").toString(), "text/plain;charset=utf-8;test=\"test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,").toString(), "text/plain;test=\"test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,").toString(), "text/plain;charset=\" utf-8\";test=\"test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,").toString(), "text/plain;charset=utf-8;test=\"test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,").toString(), "text/plain;charset=utf-8;test=\"t\\\\est,2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,").toString(), "text/plain;charset=\"ut\\\"f-8\";test=\"test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\\ ; test=test2,").toString(), "text/plain;charset=\"\\\\\";test=\"test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,").toString(), "text/plain;charset=\" ; test=test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\" ; test=test2,").toString(), "text/plain;charset=\" ; test=test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,").toString(), "text/plain;charset=;test=\"test2,\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,').toString(), "text/plain;charset=utf-16;test=\"test2,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\,").toString(), "text/plain;charset=\",\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",').toString(), "text/plain;charset=\"aa\\\\a\\\"a\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    assert.strictEqual(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,').toString(), "text/plain;x=\"http://example.com/x?a=1\";charset=\"a,\"");
    assert.strictEqual(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,').toString(), "text/plain;x=\"http://example.com/x?a=1\";charset=\"a,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,").toString(), "text/plain;charset=utf-8;test=test2");

    assert.throws(() => {
      MediaType.fromString("text/plain,%3C");
    }, {
      name: "TypeError",
      message: "subtypeName"
    });

    assert.throws(() => {
      MediaType.fromString(" text/plain ,%3C");
    }, {
      name: "TypeError",
      message: "subtypeName"
    });

    assert.strictEqual(MediaType.fromString("text/plain;,%3C").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ;,%3C").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; ,%3C").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset,%3C").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset ,%3C").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset=utf-8 ,%3C").toString(), "text/plain;charset=\"utf-8 ,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=UTF-8,%3C").toString(), "text/plain;charset=\"UTF-8,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test,%3C").toString(), "text/plain;charset=utf-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8; test=test2,%3C").toString(), "text/plain;charset=utf-8;test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,%3C").toString(), "text/plain;charset=utf-8;test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,%3C").toString(), "text/plain;test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,%3C").toString(), "text/plain;charset=\" utf-8\";test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,%3C").toString(), "text/plain;charset=utf-8;test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,%3C").toString(), "text/plain;charset=utf-8;test=\"t\\\\est,2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,%3C").toString(), "text/plain;charset=\"ut\\\"f-8\";test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\\ ; test=test2,%3C").toString(), "text/plain;charset=\"\\\\\";test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,%3C").toString(), "text/plain;charset=\" ; test=test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\" ; test=test2,%3C").toString(), "text/plain;charset=\" ; test=test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,%3C").toString(), "text/plain;charset=;test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,%3C').toString(), "text/plain;charset=utf-16;test=\"test2,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\,%3C").toString(), "text/plain;charset=\",%3C\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",%3C').toString(), "text/plain;charset=\"aa\\\\a\\\"a\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",%3C').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    assert.strictEqual(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,%3C').toString(), "text/plain;x=\"http://example.com/x?a=1\";charset=\"a,%3C\"");
    assert.strictEqual(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,%3C').toString(), "text/plain;x=\"http://example.com/x?a=1\";charset=\"a,%3C\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,%3C").toString(), "text/plain;charset=utf-8;test=test2");

    assert.strictEqual(MediaType.fromString("text/plain;base64,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString(" text/plain ;base64,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain;;base64,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ;;base64,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; ;base64,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset;base64,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset ;base64,").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset=utf-8 ;base64,").toString(), "text/plain;charset=utf-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=UTF-8;base64,").toString(), "text/plain;charset=UTF-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test;base64,").toString(), "text/plain;charset=utf-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8; test=test2;base64,").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2;base64,").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2;base64,").toString(), "text/plain;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2;base64,").toString(), "text/plain;charset=\" utf-8\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2;base64,").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2;base64,").toString(), "text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2;base64,").toString(), "text/plain;charset=\"ut\\\"f-8\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\\ ; test=test2;base64,").toString(), "text/plain;charset=\"\\\\\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2;base64,").toString(), "text/plain;charset=\" ; test=test2;base64,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\" ; test=test2;base64,").toString(), "text/plain;charset=\" ; test=test2;base64,\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\" ; test=test2;base64,").toString(), "text/plain;charset=;test=test2");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2;base64,').toString(), "text/plain;charset=utf-16;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\;base64,").toString(), "text/plain;charset=\";base64,\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a";base64,').toString(), "text/plain;charset=\"aa\\\\a\\\"a\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1";base64,').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    assert.strictEqual(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a;base64,').toString(), "text/plain;x=\"http://example.com/x?a=1\";charset=a");
    assert.strictEqual(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a;base64,').toString(), "text/plain;x=\"http://example.com/x?a=1\";charset=a");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis;base64,").toString(), "text/plain;charset=utf-8;test=test2");

    assert.throws(() => {
      MediaType.fromString("text");
    }, {
      name: "TypeError",
      message: "typeName"
    });

    assert.throws(() => {
      MediaType.fromString("あ");
    }, {
      name: "TypeError",
      message: "typeName"
    });

    assert.throws(() => {
      MediaType.fromString("あ/");
    }, {
      name: "TypeError",
      message: "typeName"
    });

    assert.throws(() => {
      MediaType.fromString("text/");
    }, {
      name: "TypeError",
      message: "subtypeName"
    });

    assert.throws(() => {
      MediaType.fromString("text/;");
    }, {
      name: "TypeError",
      message: "subtypeName"
    });

    assert.throws(() => {
      MediaType.fromString("/test");
    }, {
      name: "TypeError",
      message: "typeName"
    });

    assert.throws(() => {
      MediaType.fromString("/");
    }, {
      name: "TypeError",
      message: "typeName"
    });

    assert.throws(() => {
      MediaType.fromString("");
    }, {
      name: "TypeError",
      message: "typeName"
    });

    assert.throws(() => {
      MediaType.fromString("text/t/t");
    }, {
      name: "TypeError",
      message: "subtypeName"
    });

    assert.throws(() => {
      MediaType.fromString("text/t,t");
    }, {
      name: "TypeError",
      message: "subtypeName"
    });

  });

});

describe("MediaType.prototype.getParameterValue", () => {
  it("getParameterValue(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.getParameterValue("charset"), null);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.getParameterValue("charset"), "uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.getParameterValue("charset"), "uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    assert.strictEqual(i3.getParameterValue("charset"), "uTf-8");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    assert.strictEqual(i4.getParameterValue("charset"), "uTf-8");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.getParameterValue("charset"), "uTf-8 ");

  });

});

describe("MediaType.prototype.hasParameter", () => {
  it("hasParameter(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.hasParameter("charset"), false);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.hasParameter("charset"), true);

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.hasParameter("charset"), true);

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.hasParameter("charset"), true);

  });

});

describe("MediaType.prototype.originalString", () => {
  it("originalString", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.originalString, "text/plain");

    const i0b = MediaType.fromString("text/plain ");
    assert.strictEqual(i0b.originalString, "text/plain");

    const i0c = MediaType.fromString("text/plain; charset=Utf-8  ");
    assert.strictEqual(i0c.originalString, "text/plain; charset=Utf-8");
    assert.strictEqual(i0c.toString(), "text/plain;charset=Utf-8");
    assert.strictEqual(i0c.withParameters([["charset","utf-8"]]).originalString, "text/plain;charset=utf-8");

  });

});

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
    assert.strictEqual(i, 2);

  });

});

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
    assert.strictEqual(i, 2);

  });

});

describe("MediaType.prototype.subtype", () => {
  it("subtype", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.subtype, "plain");

    const i0b = MediaType.fromString("text/PLAIN");
    assert.strictEqual(i0b.subtype, "plain");

  });

});

describe("MediaType.prototype.toJSON", () => {
  it("toJSON()", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.toJSON(), "text/plain");

    assert.strictEqual(JSON.stringify({x:1,y:i0}), '{"x":1,"y":"text/plain"}');

  });

});

describe("MediaType.prototype.toString", () => {
  it("toString()", () => {
    const i0 = MediaType.fromString("text/PLAIN");
    assert.strictEqual(i0.toString(), "text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.toString(), "text/plain;charset=uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.toString(), "text/plain;charset=uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    assert.strictEqual(i3.toString(), "text/plain;charset=uTf-8;x=9");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    assert.strictEqual(i4.toString(), "text/plain;charset=uTf-8;x=9");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.toString(), "text/plain;charset=\"uTf-8 \";x=9");

    const i6 = MediaType.fromString("text/plain;y=7; charset=uTf-8 ; x=9");
    assert.strictEqual(i6.toString(), "text/plain;y=7;charset=uTf-8;x=9");

  });

});

describe("MediaType.prototype.type", () => {
  it("type", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.type, "text");

  });

});

describe("MediaType.prototype.withParameters", () => {
  it("withParameters(Array)", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.withParameters([]).toString(), "text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.withParameters([]).toString(), "text/plain");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.withParameters([]).toString(), "text/plain");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    assert.strictEqual(i3.withParameters([]).toString(), "text/plain");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    assert.strictEqual(i4.withParameters([]).toString(), "text/plain");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.withParameters([]).toString(), "text/plain");

    const i6 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i6.withParameters([["hoge","http://"],["charset","utf-16be"]]).toString(), "text/plain;hoge=\"http://\";charset=utf-16be");
    assert.strictEqual(i6.toString(), "text/plain;charset=\"uTf-8 \";x=9");

    const i7 = MediaType.fromString("text/plain");
    assert.throws(() => {
      i7.withParameters([["a","1"],["a","2"]]);
    }, {
      name: "TypeError",
      message: "parameters"
    });

  });

});

describe("MediaType.prototype.withoutParameters", () => {
  it("withoutParameters()", () => {
    const i0 = MediaType.fromString("text/plain");
    assert.strictEqual(i0.withoutParameters().toString(), "text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    assert.strictEqual(i1.withoutParameters().toString(), "text/plain");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    assert.strictEqual(i2.withoutParameters().toString(), "text/plain");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    assert.strictEqual(i3.withoutParameters().toString(), "text/plain");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    assert.strictEqual(i4.withoutParameters().toString(), "text/plain");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    assert.strictEqual(i5.withoutParameters().toString(), "text/plain");
    assert.strictEqual(i5.toString(), "text/plain;charset=\"uTf-8 \";x=9");

  });

});
