import { StringUtils } from "https://raw.githubusercontent.com/i-xi-dev/str.es/1.0.5/mod.ts";
import { HttpUtils } from "https://raw.githubusercontent.com/i-xi-dev/http-utils.es/2.1.0/mod.ts";
import { Http } from "https://raw.githubusercontent.com/i-xi-dev/http.es/1.0.0/mod.ts";

const {
  HTTP_QUOTED_STRING_TOKEN,
  HTTP_TOKEN,
  HTTP_WHITESPACE,
} = HttpUtils.Pattern;

/**
 * 文字列の先頭からメディアタイプのタイプ名を抽出し返却
 *
 * @param input 文字列
 * @returns パース結果
 */
function _collectTypeName(input: string): HttpUtils.CollectResult {
  const u002FIndex = input.indexOf("/");
  let typeName = "";
  if (u002FIndex >= 0) {
    typeName = input.substring(0, u002FIndex);
  }

  return {
    collected: typeName,
    progression: typeName.length,
  };
}

/**
 * 文字列の先頭からメディアタイプのサブタイプ名を抽出し返却
 *
 * @param input 文字列
 * @returns パース結果
 */
function _collectSubtypeName(input: string): HttpUtils.CollectResult {
  let subtypeName: string;
  let progression: number;
  let followingParameters = false;
  if (input.includes(";")) {
    // 「;」あり（パラメーターあり）
    const u003BIndex = input.indexOf(";");
    subtypeName = input.substring(0, u003BIndex);
    progression = u003BIndex;
    followingParameters = true;
  } else {
    // パラメーター無し
    subtypeName = input;
    progression = input.length;
  }

  subtypeName = StringUtils.trimEnd(subtypeName, HTTP_WHITESPACE);

  return {
    collected: subtypeName,
    progression,
    following: followingParameters,
  };
}

/**
 * パラメーター値終端位置
 */
type _PrameterValueEnd = {
  /** パラメーター値終端位置のインデックス */
  valueEndIndex: number;

  /** 後続がパース不可能（または不要）であるか否か */
  parseEnd: boolean;
};

/**
 * 文字列の先頭からメディアタイプのパラメーター値終端位置を抽出し返却
 *
 * @param input 文字列
 * @returns パラメーター値終端位置
 */
function _detectPrameterValueEnd(input: string): _PrameterValueEnd {
  let valueEndIndex = -1;
  let parseEnd = false;
  const u003BIndex = input.indexOf(";");
  if (u003BIndex >= 0) {
    valueEndIndex = u003BIndex;
  }

  if (valueEndIndex < 0) {
    valueEndIndex = input.length;
    parseEnd = true;
  }

  return {
    valueEndIndex,
    parseEnd,
  };
}

namespace MediaType {
  /**
   * The string tuple represents a MIME type parameter.
   */
  export type Parameter = [name: string, value: string];

  /**
   * The `MediaType` equivalent comparison option.
   */
  export type CompareOptions = {
    /**
     * The set of parameter names that ignores the case of the parameter value.
     */
    caseInsensitiveParameters: Array<string>;
  };
}

/**
 * The object representation of MIME type.
 * The `MediaType` instances are immutable.
 */
class MediaType {
  /**
   * タイプ名
   */
  #typeName: string;

  /**
   * サブタイプ名
   */
  #subtypeName: string;

  /**
   * パラメーターの辞書
   * パラメーター名の重複は許可しない
   */
  #parameters: Map<string, string>;

  /**
   * パース前の文字列
   */
  #original: string;

  /**
   * @param typeName The type of the MIME type.
   * @param subtypeName The subtype of the MIME type.
   * @param parameters The parameters of the MIME type.
   * @param original The original string that was passed to the `fromString` method.
   * @throws {TypeError} The `typeName` is empty or contains invalid characters.
   * @throws {TypeError} The `subtypeName` is empty or contains invalid characters.
   * @throws {TypeError} The `parameters` contains duplicate parameters.
   */
  private constructor(
    typeName: string,
    subtypeName: string,
    parameters: Array<MediaType.Parameter> = [],
    original = "",
  ) {
    if (StringUtils.matches(typeName, HTTP_TOKEN) !== true) {
      throw new TypeError("typeName");
    }
    if (StringUtils.matches(subtypeName, HTTP_TOKEN) !== true) {
      throw new TypeError("subtypeName");
    }

    const parameterMap = new Map(parameters.map((entry) => {
      return [
        entry[0].toLowerCase(),
        entry[1],
      ];
    }));
    if (parameters.length !== parameterMap.size) {
      throw new TypeError("parameters");
    }

    this.#typeName = typeName.toLowerCase();
    this.#subtypeName = subtypeName.toLowerCase();
    this.#parameters = parameterMap;
    this.#original = original;

    Object.freeze(this);
  }

  /**
   * The [type](https://mimesniff.spec.whatwg.org/#type) of this MIME type.
   *
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * mediaType.type;
   * // → "application"
   * ```
   */
  get type(): string {
    return this.#typeName;
  }

  /**
   * The [subtype](https://mimesniff.spec.whatwg.org/#subtype) of this MIME type.
   *
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * mediaType.subtype;
   * // → "soap+xml"
   * ```
   */
  get subtype(): string {
    return this.#subtypeName;
  }

  /**
   * The +suffix (structured syntax suffix) of this MIME type.
   *
   * @see [https://www.iana.org/assignments/media-type-structured-suffix](https://www.iana.org/assignments/media-type-structured-suffix)
   *
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * mediaType.suffix;
   * // → "+xml"
   * ```
   */
  get suffix(): string {
    if (this.subtype.includes("+")) {
      const subtype = this.subtype;
      return subtype.substring(subtype.lastIndexOf("+"));
    }
    return "";
  }

  /**
   * The [essence](https://mimesniff.spec.whatwg.org/#mime-type-essence) of this MIME type.
   *
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * mediaType.essence;
   * // → "application/soap+xml"
   * ```
   */
  get essence(): string {
    return this.#typeName + "/" + this.#subtypeName;
  }

  /**
   * When this instance was generated by the `fromString` method, The original string that was passed to the `fromString` method;
   * Otherwise, A serialized string representation.
   */
  get originalString(): string {
    if (this.#original === "") {
      return this.toString();
    }
    return this.#original;
  }

  // static create = Object.freeze({
  //   applicationType(subtypeName: string, parameters?: Array<MediaType.Parameter>): MediaType {
  //     return new MediaType("application", subtypeName, parameters);
  //   },
  //   audio,example,font,image,message,model,multipart,text,video
  // }) as ;

  /**
   * Parses a string representation of a MIME type.
   *
   * @param text The string to be parsed.
   * @returns A `MediaType` instance.
   * @throws {TypeError} The `text` is not contain the [type](https://mimesniff.spec.whatwg.org/#type) of a MIME type.
   * @throws {TypeError} The extracted [subtype](https://mimesniff.spec.whatwg.org/#subtype) is empty or contains invalid characters.
   * @throws {TypeError} The extracted parameters contains duplicate parameters.
   * @see [https://mimesniff.spec.whatwg.org/#parsing-a-mime-type](https://mimesniff.spec.whatwg.org/#parsing-a-mime-type)
   */
  static fromString(text: string): MediaType {
    const trimmedText = StringUtils.trim(text, HTTP_WHITESPACE);

    let work = trimmedText;
    let i = 0;

    // [mimesniff 4.4.]-1,2 削除済

    // [mimesniff 4.4.]-3
    const { collected: typeName, progression: typeNameLength } =
      _collectTypeName(work);
    if (typeNameLength <= 0) {
      throw new TypeError("typeName");
    }

    // [mimesniff 4.4.]-4,5 はコンストラクターではじかれる

    // [mimesniff 4.4.]-6
    work = work.substring(typeNameLength + 1);
    i = i + typeNameLength + 1;

    // [mimesniff 4.4.]-7,8
    const { collected: subtypeName, progression: subtypeNameEnd, following } =
      _collectSubtypeName(work);
    work = (following === true) ? work.substring(subtypeNameEnd) : "";
    i = i + subtypeNameEnd;

    // [mimesniff 4.4.]-9 はコンストラクターではじかれる

    // [mimesniff 4.4.]-10 はコンストラクターで行う

    if (work.length <= 0) {
      return new MediaType(
        typeName,
        subtypeName,
        [],
        trimmedText.substring(0, i),
      );
    }

    // [mimesniff 4.4.]-11
    const parameterEntries: Array<MediaType.Parameter> = [];
    while (work.length > 0) {
      // [mimesniff 4.4.]-11.1
      work = work.substring(1);
      i = i + 1;

      // [mimesniff 4.4.]-11.2
      const startHttpSpaces2 = StringUtils.collectStart(work, HTTP_WHITESPACE);
      work = work.substring(startHttpSpaces2.length);
      i = i + startHttpSpaces2.length;

      // [mimesniff 4.4.]-11.3
      const u003BIndex = work.indexOf(";");
      const u003DIndex = work.indexOf("=");

      let delimIndex = -1;
      if ((u003BIndex >= 0) && (u003DIndex >= 0)) {
        delimIndex = Math.min(u003BIndex, u003DIndex);
      } else if (u003BIndex >= 0) {
        delimIndex = u003BIndex;
      } else if (u003DIndex >= 0) {
        delimIndex = u003DIndex;
      }

      let parameterName: string;
      if (delimIndex >= 0) {
        parameterName = work.substring(0, delimIndex);
      } else {
        parameterName = work;
      }
      work = work.substring(parameterName.length);
      i = i + parameterName.length;

      // [mimesniff 4.4.]-11.4 はコンストラクターで行う

      // [mimesniff 4.4.]-11.5.1
      if (work.startsWith(";")) {
        continue;
      }

      // [mimesniff 4.4.]-11.5.2
      if (work.startsWith("=")) {
        work = work.substring(1);
        i = i + 1;
      }

      // [mimesniff 4.4.]-11.6
      if (work.length <= 0) {
        break;
      }

      // [mimesniff 4.4.]-11.7
      let parameterValue: string;

      if (work.startsWith('"')) {
        // [mimesniff 4.4.]-11.8.1
        const { collected, progression } = HttpUtils.collectHttpQuotedString(
          work,
        );
        work = work.substring(progression);
        i = i + progression;
        parameterValue = collected;

        // [mimesniff 4.4.]-11.8.2
        const { valueEndIndex, parseEnd } = _detectPrameterValueEnd(work);
        work = (parseEnd === true) ? "" : work.substring(valueEndIndex);
        i = i + valueEndIndex;
      } else {
        // [mimesniff 4.4.]-11.9.1
        const { valueEndIndex, parseEnd } = _detectPrameterValueEnd(work);
        parameterValue = work.substring(0, valueEndIndex);
        work = (parseEnd === true) ? "" : work.substring(valueEndIndex);
        i = i + valueEndIndex;

        // [mimesniff 4.4.]-11.9.2
        parameterValue = StringUtils.trimEnd(parameterValue, HTTP_WHITESPACE);

        // [mimesniff 4.4.]-11.9.3
        if (parameterValue.length <= 0) {
          continue;
        }
      }

      // [mimesniff 4.4.]-11.10
      if (StringUtils.matches(parameterName, HTTP_TOKEN) !== true) {
        continue;
      }
      if (
        (StringUtils.matches(parameterValue, HTTP_QUOTED_STRING_TOKEN) !==
          true) && (parameterValue.length > 0)
      ) {
        continue;
      }
      if (parameterEntries.some((param) => param[0] === parameterName)) {
        continue;
      }
      parameterEntries.push([
        parameterName,
        parameterValue,
      ]);
    }

    return new MediaType(
      typeName,
      subtypeName,
      parameterEntries,
      trimmedText.substring(0, i),
    );
  }

  #format(sortParameters = false): string {
    const parameterNames = [...this.#parameters.keys()];
    if (sortParameters === true) {
      parameterNames.sort();
    }
    let parameters = "";
    for (const parameterName of parameterNames) {
      parameters = parameters + ";" + parameterName + "=";

      const parameterValue = this.#parameters.get(parameterName) as string;
      if (
        (StringUtils.matches(parameterValue, HTTP_TOKEN) === true) ||
        (parameterValue.length === 0)
      ) {
        parameters = parameters + parameterValue;
      } else {
        parameters = parameters + '"' +
          parameterValue.replaceAll("\\", "\\\\").replaceAll('"', '\\"') + '"';
      }
    }
    return this.#typeName + "/" + this.#subtypeName + parameters;
  }

  /**
   * Returns a serialized string representation.
   *
   * @override
   * @returns A serialized string representation.
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * mediaType.toString();
   * // → 'application/soap+xml;charset=utf-8;action="https://example.com/example"'
   * ```
   */
  toString(): string {
    return this.#format();
  }

  /**
   * Returns a serialized string representation.
   *
   * @returns A serialized string representation.
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * mediaType.toJSON();
   * // → 'application/soap+xml;charset=utf-8;action="https://example.com/example"'
   * ```
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * Returns a new iterator object that contains the names for each parameter in this MIME type.
   *
   * @returns A new iterator object.
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * [ ...mediaType.parameterNames() ];
   * // → [ "charset", "action" ]
   * ```
   */
  parameterNames(): IterableIterator<string> {
    return this.#parameters.keys();
  }

  /**
   * Returns a new iterator object that contains the name-value pairs for each parameter in this MIME type.
   *
   * @returns A new iterator object.
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * [ ...mediaType.parameters() ];
   * // → [ ["charset", "utf-8"], ["action", "https://example.com/example"] ]
   * ```
   */
  parameters(): IterableIterator<MediaType.Parameter> {
    return this.#parameters.entries();
  }

  // XXX sort parameters

  /**
   * Determines whether the MIME type represented by this instance is equal to the MIME type represented by other instance.
   *
   * @param other The other instance of `MediaType`.
   * @param options The `MediaType.CompareOptions` dictionary.
   * @returns If two MIME types are equal, `true`; Otherwise, `false`.
   * @example
   * ```javascript
   * const mediaTypeA = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * const mediaTypeB = MediaType.fromString('application/soap+xml; charset=utf-16;action="https://example.com/example"');
   * mediaTypeA.equals(mediaTypeB);
   * // → false
   *
   * const mediaTypeC = MediaType.fromString('APPLICATION/SOAP+XML;ACTION="https://example.com/example";CHARSET=utf-8');
   * mediaTypeA.equals(mediaTypeC);
   * // → true
   *
   * const mediaTypeD = MediaType.fromString('application/soap+xml; charset=UTF-8;action="https://example.com/example"');
   * mediaTypeA.equals(mediaTypeD);
   * // → false
   * mediaTypeA.equals(mediaTypeD, { caseInsensitiveParameters: ["charset"] });
   * // → true
   * ```
   */
  equals(other: MediaType, options?: MediaType.CompareOptions): boolean { // TODO
    if (other instanceof MediaType) {
      if (options && Array.isArray(options.caseInsensitiveParameters)) {
        const thisParams = [...this.parameters()].map(
          ([paramName, paramValue]) => {
            return [
              paramName,
              options.caseInsensitiveParameters.includes(paramName)
                ? paramValue.toLowerCase()
                : paramValue,
            ] as MediaType.Parameter;
          },
        );
        const thisClone = new MediaType(this.type, this.subtype, thisParams);

        const objParams = [...other.parameters()].map(
          ([paramName, paramValue]) => {
            return [
              paramName,
              options.caseInsensitiveParameters.includes(paramName)
                ? paramValue.toLowerCase()
                : paramValue,
            ] as MediaType.Parameter;
          },
        );
        const objClone = new MediaType(other.type, other.subtype, objParams);

        return (thisClone.#format(true) === objClone.#format(true));
      }
      return (this.#format(true) === other.#format(true));
    }
    return false;
  }

  /**
   * Returns whether this MIME type has the specified parameter.
   *
   * @param parameterName The parameter name.
   * @returns If this MIME type has the specified parameter, `true`; Otherwise, `false`.
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * mediaType.hasParameter("charset");
   * // → true
   *
   * mediaType.hasParameter("foo");
   * // → false
   * ```
   */
  hasParameter(parameterName: string): boolean {
    const normalizedName = parameterName.toLowerCase();
    return this.#parameters.has(normalizedName);
  }

  /**
   * Returns a value of a specified parameter of this MIME type.
   *
   * @param parameterName The parameter name.
   * @returns A parameter value. If the parameter does not exist, `null`.
   * @example
   * ```javascript
   * const mediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * mediaType.getParameterValue("charset");
   * // → "https://example.com/example"
   *
   * mediaType.getParameterValue("foo");
   * // → null
   * ```
   */
  getParameterValue(parameterName: string): string | null {
    const normalizedName = parameterName.toLowerCase();
    if (this.#parameters.has(normalizedName) !== true) {
      return null;
    }
    return this.#parameters.get(normalizedName) as string;
  }

  /**
   * Returns a copy of this instance with the specified parameters.
   *
   * @param parameters The set of parameter name-value pairs.
   * @returns A new instance.
   * @throws {TypeError} The `parameters` contains duplicate parameters.
   * @example
   * ```javascript
   * const sourceMediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * const paramsModifiedClone = sourceMediaType.withParameters([ ["charset": "UTF-16"] ]);
   * paramsModifiedClone.toString();
   * // → 'application/soap+xml;charset=UTF-16'
   *
   * sourceMediaType.toString();
   * // → 'application/soap+xml;charset=utf-8;action="https://example.com/example"'
   * ```
   */
  withParameters(parameters: Array<MediaType.Parameter>): MediaType {
    return new MediaType(this.#typeName, this.#subtypeName, parameters);
  }

  /**
   * Returns a copy of this instance with no parameters.
   *
   * @returns A new instance.
   * @example
   * ```javascript
   * const sourceMediaType = MediaType.fromString('application/soap+xml; charset=utf-8;action="https://example.com/example"');
   *
   * const paramsRemovedClone = sourceMediaType.withoutParameters();
   * paramsRemovedClone.toString();
   * // → 'application/soap+xml'
   *
   * sourceMediaType.toString();
   * // → 'application/soap+xml;charset=utf-8;action="https://example.com/example"'
   * ```
   */
  withoutParameters(): MediaType {
    return new MediaType(this.#typeName, this.#subtypeName);
  }

  // (await Body.blob()).type と同じになるはず？
  /**
   * @experimental
   * @param headers The `Headers` object of `Request` or `Response`.
   * @returns A `MediaType` instance.
   * @see {@link https://fetch.spec.whatwg.org/#content-type-header `Content-Type` header (Fetch standard)}
   */
  static fromHeaders(headers: Headers): MediaType {
    const CHARSET = "charset";

    // 5.
    if (headers.has(Http.Header.CONTENT_TYPE) !== true) {
      throw new Error("Content-Type field not found");
    }

    // 4, 5.
    const typesString = headers.get(Http.Header.CONTENT_TYPE) as string;
    const typeStrings = HttpUtils.valuesOfHeaderFieldValue(typesString);
    if (typeStrings.length <= 0) {
      throw new Error("Content-Type value not found");
    }

    // 1, 2, 3.
    let textEncoding = "";
    let mediaTypeEssence = "";
    let mediaType: MediaType | null = null;
    // 6.
    for (const typeString of typeStrings) {
      try {
        // 6.1.
        const tempMediaType = MediaType.fromString(typeString);

        // 6.3.
        mediaType = tempMediaType;

        // 6.4.
        if (mediaTypeEssence !== mediaType.essence) {
          // 6.4.1.
          textEncoding = "";
          // 6.4.2.
          if (mediaType.hasParameter(CHARSET)) {
            textEncoding = mediaType.getParameterValue(CHARSET) as string;
          }
          // 6.4.3.
          mediaTypeEssence = mediaType.essence;
        } else {
          // 6.5.
          if (
            (mediaType.hasParameter(CHARSET) !== true) &&
            (textEncoding !== "")
          ) {
            // TODO mediaType.withParameters()
          }
        }
      } catch (exception) {
        console.log(exception); // TODO 消す
        // 6.2. "*/*"はMediaType.fromStringでエラーにしている
        continue;
      }
    }

    // 7, 8.
    if (mediaType !== null) {
      return mediaType;
    } else {
      throw new Error("extraction failure");
    }
  }
}
Object.freeze(MediaType);

export { MediaType };
