# @i-xi-dev/mimetype

A JavaScript MIME type parser and serializer, implements [the MIME type defined in WHATWG MIME Sniffing Standard](https://mimesniff.spec.whatwg.org/#understanding-mime-types).


## Requirement

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |


## Installation

### npm

```console
$ npm i @i-xi-dev/mimetype@1.2.14
```

```javascript
import { MediaType } from "@i-xi-dev/mimetype";
```

### CDN

Example for Skypack
```javascript
import { MediaType } from "https://cdn.skypack.dev/@i-xi-dev/mimetype@1.2.14";
```


## Usage

### [`MediaType`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/mimetype.es/1.2.14/mod.ts/~/MediaType) class

Parse a MIME type string
```javascript
const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');

mediaType.type;
// → "application"

mediaType.subtype;
// → "soap+xml"

mediaType.essence;
// → "application/soap+xml"

[ ...mediaType.parameterNames() ];
// → [ "charset", "action" ]

[ ...mediaType.parameters() ];
// → [ ["charset", "utf-8"], ["action", "https://example.com/example"] ]

mediaType.hasParameter("charset");
// → true

mediaType.getParameterValue("action");
// → "https://example.com/example"
```

Serialize a MIME type
```javascript
const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
mediaType.toString();
// → 'application/soap+xml;charset=utf-8;action="https://example.com/example"'
```

Equivalent comparisons
```javascript
const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');

const mediaType2 = MediaType.fromString('application/soap+xml; charset=utf-16;action="https://example.com/example"');
mediaType.equals(mediaType2);
// → false

const mediaType3 = MediaType.fromString('APPLICATION/SOAP+XML;ACTION="https://example.com/example";CHARSET=utf-8');
mediaType.equals(mediaType3);
// → true

const mediaType4 = MediaType.fromString('application/soap+xml; charset=UTF-8;action="https://example.com/example"');
mediaType.equals(mediaType4);
// → false
mediaType.equals(mediaType4, { caseInsensitiveParameters: ["charset"] });
// → true
```

Instance is immutable
```javascript
const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');

const mediaType2 = mediaType.withParameters([ ["charset": "UTF-16"] ]);
mediaType2.toString();
// → 'application/soap+xml;charset=UTF-16'
const mediaType3 = mediaType.withoutParameters();
mediaType3.toString();
// → 'application/soap+xml'
mediaType.toString();
// → 'application/soap+xml;charset=utf-8;action="https://example.com/example"'
```
