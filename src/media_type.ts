//

import {
  type CollectResult,
  CodePointRange,
  collectHttpQuotedString,
  collectStart,
  matches,
  trim,
  trimEnd,
} from "@i-xi-dev/fundamental";

const {
  HTTP_QUOTED_STRING_TOKEN,
  HTTP_TOKEN,
  HTTP_WHITESPACE,
} = CodePointRange;

/**
 * The string tuple represents a MIME type parameter.
 */
type MediaTypeParameter = [ name: string, value: string ];

/**
 * 文字列の先頭からメディアタイプのタイプ名を抽出し返却
 * 
 * @param input - 文字列
 * @returns パース結果
 */
function collectTypeName(input: string): CollectResult {
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
 * @param input - 文字列
 * @returns パース結果
 */
function collectSubtypeName(input: string): CollectResult {
  let subtypeName: string;
  let progression: number;
  let followingParameters = false;
  if (input.includes(";")) {
    // 「;」あり（パラメーターあり）
    const u003BIndex = input.indexOf(";");
    subtypeName = input.substring(0, u003BIndex);
    progression = u003BIndex;
    followingParameters = true;
  }
  else {
    // パラメーター無し
    subtypeName = input;
    progression = input.length;
  }

  subtypeName = trimEnd(subtypeName, HTTP_WHITESPACE);

  return {
    collected: subtypeName,
    progression,
    following: followingParameters,
  };
}

/**
 * パラメーター値終端位置
 */
type PrameterValueEnd = {
  /** パラメーター値終端位置のインデックス */
  valueEndIndex: number,

  /** 後続がパース不可能（または不要）であるか否か */
  parseEnd: boolean,
};

/**
 * 文字列の先頭からメディアタイプのパラメーター値終端位置を抽出し返却
 * 
 * @param input - 文字列
 * @returns パラメーター値終端位置
 */
function detectPrameterValueEnd(input: string): PrameterValueEnd {
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

/**
 * The `MediaType` equivalent comparison option.
 */
type MediaTypeCompareOptions = {
  /**
   * The set of parameter names that ignores the case of the parameter value.
   */
  caseInsensitiveParameters: Array<string>;
};

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
   * @param typeName - The type of the MIME type.
   * @param subtypeName - The subtype of the MIME type.
   * @param parameters パラメーターのエントリーの配列
   * @param original - The original string that was passed to the `fromString` method.
   * @throws {TypeError} The `typeName` is empty or contains invalid characters.
   * @throws {TypeError} The `subtypeName` is empty or contains invalid characters.
   * @throws {TypeError} The `parameters` contains duplicate parameters.
   */
  private constructor(typeName: string, subtypeName: string, parameters: Array<MediaTypeParameter> = [], original = "") {
    if ((typeName.length <= 0) || (matches(typeName, HTTP_TOKEN) !== true)) {
      throw new TypeError("typeName");
    }
    if ((subtypeName.length <= 0) || (matches(subtypeName, HTTP_TOKEN) !== true)) {
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
   */
  get type(): string {
    return this.#typeName;
  }

  /**
   * The [subtype](https://mimesniff.spec.whatwg.org/#subtype) of this MIME type.
   */
  get subtype(): string {
    return this.#subtypeName;
  }

  /**
   * The [essence](https://mimesniff.spec.whatwg.org/#mime-type-essence) of this MIME type.
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
  //   applicationType(subtypeName: string, parameters?: Array<MediaTypeParameter>): MediaType {
  //     return new MediaType("application", subtypeName, parameters);
  //   },
  //   audio,example,font,image,message,model,multipart,text,video
  // }) as ;

  /**
   * Parses a string representation of a MIME type.
   * 
   * @param text - The string to be parsed.
   * @returns A `MediaType` instance.
   * @throws {TypeError} The `text` is not contain the [type](https://mimesniff.spec.whatwg.org/#type) of a MIME type.
   * @throws {TypeError} The extracted [subtype](https://mimesniff.spec.whatwg.org/#subtype) is empty or contains invalid characters.
   * @throws {TypeError} The extracted parameters contains duplicate parameters.
   * @see [https://mimesniff.spec.whatwg.org/#parsing-a-mime-type](https://mimesniff.spec.whatwg.org/#parsing-a-mime-type)
   */
  static fromString(text: string): MediaType {
    const trimmedText = trim(text, HTTP_WHITESPACE);

    let work = trimmedText;
    let i = 0;

    // [mimesniff 4.4.]-1,2 削除済

    // [mimesniff 4.4.]-3
    const { collected: typeName, progression: typeNameLength } = collectTypeName(work);
    if (typeNameLength <= 0) {
      throw new TypeError("typeName");
    }

    // [mimesniff 4.4.]-4,5 はコンストラクターではじかれる

    // [mimesniff 4.4.]-6
    work = work.substring(typeNameLength + 1);
    i = i + typeNameLength + 1;

    // [mimesniff 4.4.]-7,8
    const { collected: subtypeName, progression: subtypeNameEnd, following } = collectSubtypeName(work);
    work = (following === true) ? work.substring(subtypeNameEnd) : "";
    i = i + subtypeNameEnd;

    // [mimesniff 4.4.]-9 はコンストラクターではじかれる

    // [mimesniff 4.4.]-10 はコンストラクターで行う

    if (work.length <= 0) {
      return new MediaType(typeName, subtypeName, [], trimmedText.substring(0, i));
    }

    // [mimesniff 4.4.]-11
    const parameterEntries: Array<MediaTypeParameter> = [];
    while (work.length > 0) {
      // [mimesniff 4.4.]-11.1
      work = work.substring(1);
      i = i + 1;

      // [mimesniff 4.4.]-11.2
      const startHttpSpaces2 = collectStart(work, HTTP_WHITESPACE);
      work = work.substring(startHttpSpaces2.length);
      i = i + startHttpSpaces2.length;

      // [mimesniff 4.4.]-11.3
      const u003BIndex = work.indexOf(";");
      const u003DIndex = work.indexOf("=");

      let delimIndex = -1;
      if ((u003BIndex >= 0) && (u003DIndex >= 0)) {
        delimIndex = Math.min(u003BIndex, u003DIndex);
      }
      else if (u003BIndex >= 0) {
        delimIndex = u003BIndex;
      }
      else if (u003DIndex >= 0) {
        delimIndex = u003DIndex;
      }

      let parameterName: string;
      if (delimIndex >= 0) {
        parameterName = work.substring(0, delimIndex);
      }
      else {
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
        const { collected, progression } = collectHttpQuotedString(work);
        work = work.substring(progression);
        i = i + progression;
        parameterValue = collected;

        // [mimesniff 4.4.]-11.8.2
        const { valueEndIndex, parseEnd } = detectPrameterValueEnd(work);
        work = (parseEnd === true) ? "" : work.substring(valueEndIndex);
        i = i + valueEndIndex;
      }
      else {
        // [mimesniff 4.4.]-11.9.1
        const { valueEndIndex, parseEnd } = detectPrameterValueEnd(work);
        parameterValue = work.substring(0, valueEndIndex);
        work = (parseEnd === true) ? "" : work.substring(valueEndIndex);
        i = i + valueEndIndex;

        // [mimesniff 4.4.]-11.9.2
        parameterValue = trimEnd(parameterValue, HTTP_WHITESPACE);

        // [mimesniff 4.4.]-11.9.3
        if (parameterValue.length <= 0) {
          continue;
        }
      }

      // [mimesniff 4.4.]-11.10
      if (parameterName.length <= 0) {
        continue;
      }
      if (matches(parameterName, HTTP_TOKEN) !== true) {
        continue;
      }
      if (matches(parameterValue, HTTP_QUOTED_STRING_TOKEN) !== true) {
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

    return new MediaType(typeName, subtypeName, parameterEntries, trimmedText.substring(0, i));
  }

  #format(sortParameters = false): string {
    const parameterNames = [ ...this.#parameters.keys() ];
    if (sortParameters === true) {
      parameterNames.sort();
    }
    let parameters = "";
    for (const parameterName of parameterNames) {
      parameters = parameters + ";" + parameterName + "=";

      const parameterValue = this.#parameters.get(parameterName) as string;
      if (matches(parameterValue, HTTP_TOKEN) !== true) {
        // parameters = parameters + '"' + parameterValue.replaceAll("\\", "\\\\").replaceAll('"', '\\"') + '"';
        parameters = parameters + '"' + parameterValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
      }
      else {
        parameters = parameters + parameterValue;
      }
    }
    return this.#typeName + "/" + this.#subtypeName + parameters;
  }

  /**
   * Returns a serialized string representation.
   * 
   * @override
   * @returns A serialized string representation.
   */
  toString(): string {
    return this.#format();
  }

  /**
   * Returns a serialized string representation.
   * 
   * @returns A serialized string representation.
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * Returns a new iterator object that contains the names for each parameter in this MIME type.
   * 
   * @returns A new iterator object.
   */
  parameterNames(): IterableIterator<string> {
    return this.#parameters.keys();
  }

  /**
   * Returns a new iterator object that contains the name-value pairs for each parameter in this MIME type.
   * 
   * @returns A new iterator object.
   */
  parameters(): IterableIterator<MediaTypeParameter> {
    return this.#parameters.entries();
  }

  // XXX sort parameters

  /**
   * Determines whether the MIME type represented by this instance is equal to the MIME type represented by other instance.
   * 
   * @param other - The other instance of `MediaType`.
   * @param options - The `MediaTypeCompareOptions` dictionary.
   * @returns If two MIME types are equal, `true`; Otherwise, `false`.
   */
  equals(other: MediaType, options?: MediaTypeCompareOptions): boolean { // TODO
    if (other instanceof MediaType) {
      if (options && Array.isArray(options.caseInsensitiveParameters)) {
        const thisParams = [ ...this.parameters() ].map(([ paramName, paramValue ]) => {
          return [
            paramName,
            options.caseInsensitiveParameters.includes(paramName) ? paramValue.toLowerCase() : paramValue,
          ] as MediaTypeParameter;
        });
        const thisClone = new MediaType(this.type, this.subtype, thisParams);

        const objParams = [ ...other.parameters() ].map(([ paramName, paramValue ]) => {
          return [
            paramName,
            options.caseInsensitiveParameters.includes(paramName) ? paramValue.toLowerCase() : paramValue,
          ] as MediaTypeParameter;
        });
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
   * @param parameterName - The parameter name.
   * @returns If this MIME type has the specified parameter, `true`; Otherwise, `false`.
   */
  hasParameter(parameterName: string): boolean {
    const normalizedName = parameterName.toLowerCase();
    return this.#parameters.has(normalizedName);
  }

  /**
   * Returns a value of a specified parameter of this MIME type.
   * 
   * @param parameterName - The parameter name.
   * @returns A parameter value. If the parameter does not exist, `null`.
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
   */
  withParameters(parameters: Array<MediaTypeParameter>): MediaType {
    return new MediaType(this.#typeName, this.#subtypeName, parameters);
  }

  /**
   * Returns a copy of this instance with no parameters.
   * 
   * @returns A new instance.
   */
  withoutParameters(): MediaType {
    return new MediaType(this.#typeName, this.#subtypeName);
  }
}
Object.freeze(MediaType);

export {
  type MediaTypeParameter,
  type MediaTypeCompareOptions,
  MediaType,
};
