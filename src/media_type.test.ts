import { expect } from '@esm-bundle/chai';
import { MediaType } from "./index";

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
    expect(i0.equals(i0)).to.equal(true);
    expect(i0.equals(i1)).to.equal(true);
    expect(i0.equals(undefined as unknown as MediaType)).to.equal(false);
    expect(i0.equals(i2)).to.equal(false);
    expect(i0.equals(i3)).to.equal(false);
    expect(i0.equals(i4)).to.equal(false);
    expect(i0.equals(i0b)).to.equal(true);
    expect(i0.equals(i0c)).to.equal(true);
    expect(i0.equals(i0d)).to.equal(false);

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
    expect(i0.equals(i0, op)).to.equal(true);
    expect(i0.equals(i1, op)).to.equal(true);
    expect(i0.equals(undefined as unknown as MediaType, op)).to.equal(false);
    expect(i0.equals(i2, op)).to.equal(false);
    expect(i0.equals(i3, op)).to.equal(false);
    expect(i0.equals(i4, op)).to.equal(false);
    expect(i0.equals(i0b, op)).to.equal(true);
    expect(i0.equals(i0c, op)).to.equal(true);
    expect(i0.equals(i0d, op)).to.equal(true);

  });

});

describe("MediaType.prototype.essence", () => {
  it("essence", () => {
    const i0 = MediaType.fromString("text/plain;charset=utf-8");
    expect(i0.essence).to.equal("text/plain");

  });

});

describe("MediaType.fromString", () => {
  it("fromString(string)", () => {
    expect(MediaType.fromString("text/plain").toString()).to.equal("text/plain");
    expect(MediaType.fromString(" text/plain ").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain;").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ;").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; ").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset ").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ").toString()).to.equal("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=UTF-8").toString()).to.equal("text/plain;charset=UTF-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test").toString()).to.equal("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2").toString()).to.equal("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2").toString()).to.equal("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2").toString()).to.equal("text/plain;test=test2");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2").toString()).to.equal("text/plain;charset=\" utf-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2").toString()).to.equal("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2").toString()).to.equal("text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2").toString()).to.equal("text/plain;charset=\"ut\\\"f-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2").toString()).to.equal("text/plain;charset=\"\\\\\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2").toString()).to.equal("text/plain;charset=\" ; test=test2\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2").toString()).to.equal("text/plain;charset=\" ; test=test2\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2").toString()).to.equal("text/plain;charset=;test=test2");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2').toString()).to.equal("text/plain;charset=utf-16;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\").toString()).to.equal("text/plain;charset=\"\\\\\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a"').toString()).to.equal("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1"').toString()).to.equal("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a').toString()).to.equal("text/plain;x=\"http://example.com/x?a=1\";charset=a");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a').toString()).to.equal("text/plain;x=\"http://example.com/x?a=1\";charset=a");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis").toString()).to.equal("text/plain;charset=utf-8;test=test2");

    expect(() => {
      MediaType.fromString("text/plain,");
    }).to.throw(TypeError, "subtypeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString(" text/plain ,");
    }).to.throw(TypeError, "subtypeName").with.property("name", "TypeError");

    expect(MediaType.fromString("text/plain;,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ;,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; ,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset ,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset= ;p2=3").toString()).to.equal("text/plain;p2=3");
    expect(MediaType.fromString("text/plain ; p1=1;=3;p3=4").toString()).to.equal("text/plain;p1=1;p3=4");
    expect(MediaType.fromString("text/plain ; p1=1;p2=あ;p3=4").toString()).to.equal("text/plain;p1=1;p3=4");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ,").toString()).to.equal("text/plain;charset=\"utf-8 ,\"");
    expect(MediaType.fromString("text/plain ;charset=UTF-8,").toString()).to.equal("text/plain;charset=\"UTF-8,\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test,").toString()).to.equal("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2,").toString()).to.equal("text/plain;charset=utf-8;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,").toString()).to.equal("text/plain;charset=utf-8;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,").toString()).to.equal("text/plain;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,").toString()).to.equal("text/plain;charset=\" utf-8\";test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,").toString()).to.equal("text/plain;charset=utf-8;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,").toString()).to.equal("text/plain;charset=utf-8;test=\"t\\\\est,2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,").toString()).to.equal("text/plain;charset=\"ut\\\"f-8\";test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2,").toString()).to.equal("text/plain;charset=\"\\\\\";test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,").toString()).to.equal("text/plain;charset=\" ; test=test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2,").toString()).to.equal("text/plain;charset=\" ; test=test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,").toString()).to.equal("text/plain;charset=;test=\"test2,\"");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,').toString()).to.equal("text/plain;charset=utf-16;test=\"test2,\"");
    expect(MediaType.fromString("text/plain ;charset=\"\\,").toString()).to.equal("text/plain;charset=\",\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",').toString()).to.equal("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",').toString()).to.equal("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,').toString()).to.equal("text/plain;x=\"http://example.com/x?a=1\";charset=\"a,\"");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,').toString()).to.equal("text/plain;x=\"http://example.com/x?a=1\";charset=\"a,\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,").toString()).to.equal("text/plain;charset=utf-8;test=test2");

    expect(() => {
      MediaType.fromString("text/plain,%3C");
    }).to.throw(TypeError, "subtypeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString(" text/plain ,%3C");
    }).to.throw(TypeError, "subtypeName").with.property("name", "TypeError");

    expect(MediaType.fromString("text/plain;,%3C").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ;,%3C").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; ,%3C").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset,%3C").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset ,%3C").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ,%3C").toString()).to.equal("text/plain;charset=\"utf-8 ,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=UTF-8,%3C").toString()).to.equal("text/plain;charset=\"UTF-8,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test,%3C").toString()).to.equal("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2,%3C").toString()).to.equal("text/plain;charset=utf-8;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,%3C").toString()).to.equal("text/plain;charset=utf-8;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,%3C").toString()).to.equal("text/plain;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,%3C").toString()).to.equal("text/plain;charset=\" utf-8\";test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,%3C").toString()).to.equal("text/plain;charset=utf-8;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,%3C").toString()).to.equal("text/plain;charset=utf-8;test=\"t\\\\est,2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,%3C").toString()).to.equal("text/plain;charset=\"ut\\\"f-8\";test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2,%3C").toString()).to.equal("text/plain;charset=\"\\\\\";test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,%3C").toString()).to.equal("text/plain;charset=\" ; test=test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2,%3C").toString()).to.equal("text/plain;charset=\" ; test=test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,%3C").toString()).to.equal("text/plain;charset=;test=\"test2,%3C\"");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,%3C').toString()).to.equal("text/plain;charset=utf-16;test=\"test2,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=\"\\,%3C").toString()).to.equal("text/plain;charset=\",%3C\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",%3C').toString()).to.equal("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",%3C').toString()).to.equal("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,%3C').toString()).to.equal("text/plain;x=\"http://example.com/x?a=1\";charset=\"a,%3C\"");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,%3C').toString()).to.equal("text/plain;x=\"http://example.com/x?a=1\";charset=\"a,%3C\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,%3C").toString()).to.equal("text/plain;charset=utf-8;test=test2");

    expect(MediaType.fromString("text/plain;base64,").toString()).to.equal("text/plain");
    expect(MediaType.fromString(" text/plain ;base64,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain;;base64,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ;;base64,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; ;base64,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset;base64,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset ;base64,").toString()).to.equal("text/plain");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ;base64,").toString()).to.equal("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=UTF-8;base64,").toString()).to.equal("text/plain;charset=UTF-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test;base64,").toString()).to.equal("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2;base64,").toString()).to.equal("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2;base64,").toString()).to.equal("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2;base64,").toString()).to.equal("text/plain;test=test2");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2;base64,").toString()).to.equal("text/plain;charset=\" utf-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2;base64,").toString()).to.equal("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2;base64,").toString()).to.equal("text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2;base64,").toString()).to.equal("text/plain;charset=\"ut\\\"f-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2;base64,").toString()).to.equal("text/plain;charset=\"\\\\\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2;base64,").toString()).to.equal("text/plain;charset=\" ; test=test2;base64,\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2;base64,").toString()).to.equal("text/plain;charset=\" ; test=test2;base64,\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2;base64,").toString()).to.equal("text/plain;charset=;test=test2");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2;base64,').toString()).to.equal("text/plain;charset=utf-16;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\;base64,").toString()).to.equal("text/plain;charset=\";base64,\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a";base64,').toString()).to.equal("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1";base64,').toString()).to.equal("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a;base64,').toString()).to.equal("text/plain;x=\"http://example.com/x?a=1\";charset=a");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a;base64,').toString()).to.equal("text/plain;x=\"http://example.com/x?a=1\";charset=a");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis;base64,").toString()).to.equal("text/plain;charset=utf-8;test=test2");

    expect(() => {
      MediaType.fromString("text");
    }).to.throw(TypeError, "typeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("あ");
    }).to.throw(TypeError, "typeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("あ/");
    }).to.throw(TypeError, "typeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("text/");
    }).to.throw(TypeError, "subtypeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("text/;");
    }).to.throw(TypeError, "subtypeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("/test");
    }).to.throw(TypeError, "typeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("/");
    }).to.throw(TypeError, "typeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("");
    }).to.throw(TypeError, "typeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("text/t/t");
    }).to.throw(TypeError, "subtypeName").with.property("name", "TypeError");

    expect(() => {
      MediaType.fromString("text/t,t");
    }).to.throw(TypeError, "subtypeName").with.property("name", "TypeError");

  });

});

describe("MediaType.prototype.getParameterValue", () => {
  it("getParameterValue(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.getParameterValue("charset")).to.equal(null);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.getParameterValue("charset")).to.equal("uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.getParameterValue("charset")).to.equal("uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.getParameterValue("charset")).to.equal("uTf-8");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.getParameterValue("charset")).to.equal("uTf-8");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.getParameterValue("charset")).to.equal("uTf-8 ");

  });

});

describe("MediaType.prototype.hasParameter", () => {
  it("hasParameter(string)", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.hasParameter("charset")).to.equal(false);

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.hasParameter("charset")).to.equal(true);

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.hasParameter("charset")).to.equal(true);

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.hasParameter("charset")).to.equal(true);

  });

});

describe("MediaType.prototype.originalString", () => {
  it("originalString", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.originalString).to.equal("text/plain");

    const i0b = MediaType.fromString("text/plain ");
    expect(i0b.originalString).to.equal("text/plain");

    const i0c = MediaType.fromString("text/plain; charset=Utf-8  ");
    expect(i0c.originalString).to.equal("text/plain; charset=Utf-8");
    expect(i0c.toString()).to.equal("text/plain;charset=Utf-8");
    expect(i0c.withParameters([["charset","utf-8"]]).originalString).to.equal("text/plain;charset=utf-8");

  });

});

describe("MediaType.prototype.parameterNames", () => {
  it("parameterNames()", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(JSON.stringify([...i0.parameterNames()])).to.equal("[]");

    const i0b = MediaType.fromString("text/plain;charset=utf-8");
    expect(JSON.stringify([...i0b.parameterNames()])).to.equal('["charset"]');

    const i0c = MediaType.fromString("text/plain;charset=utf-8; a=,");
    expect(JSON.stringify([...i0c.parameterNames()])).to.equal('["charset","a"]');

    let i = 0;
    for (const p of i0c.parameterNames()) {
      if (i === 0) {
        expect(JSON.stringify(p)).to.equal('"charset"');
      }
      else if (i === 1) {
        expect(JSON.stringify(p)).to.equal('"a"');
      }

      i++;
    }
    expect(i).to.equal(2);

  });

});

describe("MediaType.prototype.parameters", () => {
  it("parameters()", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(JSON.stringify([...i0.parameters()])).to.equal("[]");

    const i0b = MediaType.fromString("text/plain;charset=utf-8");
    expect(JSON.stringify([...i0b.parameters()])).to.equal('[["charset","utf-8"]]');

    const i0c = MediaType.fromString("text/plain;charset=utf-8; a=,");
    expect(JSON.stringify([...i0c.parameters()])).to.equal('[["charset","utf-8"],["a",","]]');

    let i = 0;
    for (const p of i0c.parameters()) {
      if (i === 0) {
        expect(JSON.stringify(p)).to.equal('["charset","utf-8"]');
      }
      else if (i === 1) {
        expect(JSON.stringify(p)).to.equal('["a",","]');
      }

      i++;
    }
    expect(i).to.equal(2);

  });

});

describe("MediaType.prototype.subtype", () => {
  it("subtype", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.subtype).to.equal("plain");

    const i0b = MediaType.fromString("text/PLAIN");
    expect(i0b.subtype).to.equal("plain");

    const i0c = MediaType.fromString("image/svg+xml");
    expect(i0c.subtype).to.equal("svg+xml");

  });

});

describe("MediaType.prototype.suffix", () => {
  it("suffix", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.suffix).to.equal("");

    const i0b = MediaType.fromString("text/PLAIN");
    expect(i0b.suffix).to.equal("");

    const i0c = MediaType.fromString("image/svg+xml");
    expect(i0c.suffix).to.equal("+xml");

    const i0d = MediaType.fromString("example/aaa+bbb+ccc");
    expect(i0d.suffix).to.equal("+ccc");

  });

});

describe("MediaType.prototype.toJSON", () => {
  it("toJSON()", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.toJSON()).to.equal("text/plain");

    expect(JSON.stringify({x:1,y:i0})).to.equal('{"x":1,"y":"text/plain"}');

  });

});

describe("MediaType.prototype.toString", () => {
  it("toString()", () => {
    const i0 = MediaType.fromString("text/PLAIN");
    expect(i0.toString()).to.equal("text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.toString()).to.equal("text/plain;charset=uTf-8");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.toString()).to.equal("text/plain;charset=uTf-8");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.toString()).to.equal("text/plain;charset=uTf-8;x=9");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.toString()).to.equal("text/plain;charset=uTf-8;x=9");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.toString()).to.equal("text/plain;charset=\"uTf-8 \";x=9");

    const i6 = MediaType.fromString("text/plain;y=7; charset=uTf-8 ; x=9");
    expect(i6.toString()).to.equal("text/plain;y=7;charset=uTf-8;x=9");

  });

});

describe("MediaType.prototype.type", () => {
  it("type", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.type).to.equal("text");

  });

});

describe("MediaType.prototype.withParameters", () => {
  it("withParameters(Array)", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.withParameters([]).toString()).to.equal("text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.withParameters([]).toString()).to.equal("text/plain");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.withParameters([]).toString()).to.equal("text/plain");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.withParameters([]).toString()).to.equal("text/plain");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.withParameters([]).toString()).to.equal("text/plain");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.withParameters([]).toString()).to.equal("text/plain");

    const i6 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i6.withParameters([["hoge","http://"],["charset","utf-16be"]]).toString()).to.equal("text/plain;hoge=\"http://\";charset=utf-16be");
    expect(i6.toString()).to.equal("text/plain;charset=\"uTf-8 \";x=9");

    const i7 = MediaType.fromString("text/plain");
    expect(() => {
      i7.withParameters([["a","1"],["a","2"]]);
    }).to.throw(TypeError, "parameters").with.property("name", "TypeError");

  });

});

describe("MediaType.prototype.withoutParameters", () => {
  it("withoutParameters()", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.withoutParameters().toString()).to.equal("text/plain");

    const i1 = MediaType.fromString("text/plain;charset=uTf-8");
    expect(i1.withoutParameters().toString()).to.equal("text/plain");

    const i2 = MediaType.fromString("text/plain;CHARSET=uTf-8 ");
    expect(i2.withoutParameters().toString()).to.equal("text/plain");

    const i3 = MediaType.fromString("text/plain;charset=uTf-8 ; x=9");
    expect(i3.withoutParameters().toString()).to.equal("text/plain");

    const i4 = MediaType.fromString("text/plain;charset=\"uTf-8\" ; x=9");
    expect(i4.withoutParameters().toString()).to.equal("text/plain");

    const i5 = MediaType.fromString("text/plain;  charset=\"uTf-8 \"; x=9");
    expect(i5.withoutParameters().toString()).to.equal("text/plain");
    expect(i5.toString()).to.equal("text/plain;charset=\"uTf-8 \";x=9");

  });

});
