//

import { StringUtils } from "@i-xi-dev/fundamental";

const {
  HTTP_QUOTED_STRING_TOKEN,
  HTTP_TOKEN,
  HTTP_WHITESPACE,
} = StringUtils.RangePattern;

/**
 * 部品一つ抽出時のパース結果
 */
 type ParseResult = {
  /** 抽出した部品 */
  component: string,
  /** カーソル位置 */
  progression: number,
  /** 次の部品が後続していない場合true */
  parseEnd: boolean,
};

/**
 * 文字列の先頭からメディアタイプのタイプ名を抽出し返却
 * 
 * @param str - 文字列
 * @returns パース結果
 */
function parseTypeName(str: string): ParseResult {
  const u002FIndex = str.indexOf("/");
  let typeName = "";
  if (u002FIndex >= 0) {
    typeName = str.substring(0, u002FIndex);
  }

  return {
    component: typeName,
    progression: typeName.length,
    parseEnd: false, // 次のsubtypeは必須なのでチェックはしない（subtypeが取得できなければエラー）
  };
}

/**
 * 文字列の先頭からメディアタイプのサブタイプ名を抽出し返却
 * 
 * @param str 文字列
 * @returns パース結果
 */
function parseSubtypeName(str: string): ParseResult {
  let subtypeName: string;
  let progression: number;
  let noParameters = false;
  if (str.includes(";")) {
    // 「;」あり（パラメーターあり）
    const u003BIndex = str.indexOf(";");
    subtypeName = str.substring(0, u003BIndex);
    progression = u003BIndex;
  }
  else {
    // パラメーター無し
    subtypeName = str;
    progression = str.length;
    noParameters = true;
  }

  subtypeName = StringUtils.trimEnd(subtypeName, HTTP_WHITESPACE);

  return {
    component: subtypeName,
    progression,
    parseEnd: noParameters,
  };
}

/**
 * 文字列の先頭からメディアタイプのパラメーター値終端位置を抽出し返却
 * 
 * @param str 文字列
 * @returns パラメーター値終端位置
 */
function detectPrameterValueEnd(str: string): PrameterValueEnd {
  let valueEndIndex = -1;
  let parseEnd = false;
  const u003BIndex = str.indexOf(";");
  if (u003BIndex >= 0) {
    valueEndIndex = u003BIndex;
  }

  if (valueEndIndex < 0) {
    valueEndIndex = str.length;
    parseEnd = true;
  }

  return {
    valueEndIndex,
    parseEnd,
  };
}

/**
 * パラメーター値終端位置
 */
 type PrameterValueEnd = {
  /**
   * パラメーター値終端位置のインデックス
   */
  valueEndIndex: number,

  /**
   * 後続がパース不可能（または不要）であるか否か
   */
  parseEnd: boolean,
};

/**
 * メディアタイプ
 *     不変オブジェクト
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
   * @param typeName タイプ名
   * @param subtypeName サブタイプ名
   * @param parameterEntries パラメーターのエントリーの配列
   * @param original パース前の文字列
   */
  private constructor(typeName: string, subtypeName: string, parameterEntries: Array<[ string, string ]> = [], original = "") {
    if ((typeName.length <= 0) || (StringUtils.match(typeName, HTTP_TOKEN) !== true)) {
      throw new TypeError("typeName");
    }
    if ((subtypeName.length <= 0) || (StringUtils.match(subtypeName, HTTP_TOKEN) !== true)) {
      throw new TypeError("subtypeName");
    }

    const parameterMap = new Map(parameterEntries.map((entry) => {
      return [
        entry[0].toLowerCase(),
        entry[1],
      ];
    }));
    if (parameterEntries.length !== parameterMap.size) {
      throw new TypeError("parameterEntries");
    }

    this.#typeName = typeName;
    this.#subtypeName = subtypeName.toLowerCase();
    this.#parameters = parameterMap;
    this.#original = original;

    Object.freeze(this);
  }

  /**
   * タイプ名
   */
  get type(): string {
    return this.#typeName;
  }

  /**
   * サブタイプ名
   */
  get subtype(): string {
    return this.#subtypeName;
  }

  /**
   * The {@link [essence](https://mimesniff.spec.whatwg.org/#mime-type-essence)} of this media type.
   */
  get essence(): string {
    return this.#typeName + "/" + this.#subtypeName;
  }

  /**
   * パース前の文字列
   * ※パースして生成したのではない場合は、toString()と同じ文字列を返す
   */
  get originalString(): string {
    if (this.#original === "") {
      return this.toString();
    }
    return this.#original;
  }

  /**
   * パラメーターを持っているか否かを返却
   * 
   * @param parameterName パラメーター名
   * @returns パラメーターを持っているか否か
   */
  hasParameter(parameterName: string): boolean {
    const normalizedName = parameterName.toLowerCase();
    return this.#parameters.has(normalizedName);
  }

  /**
   * パラメーター値を返却
   * パラメーター名から値を取得できなかった場合nullを返却
   * 
   * @param parameterName パラメーター名
   * @returns パラメーター値
   */
  getParameterValue(parameterName: string): string | null {
    const normalizedName = parameterName.toLowerCase();
    if (this.#parameters.has(normalizedName) !== true) {
      return null;
    }
    return this.#parameters.get(normalizedName) as string;
  }

  /**
   * 文字列からインスタンスを生成し返却
   *     パースの仕様はhttps://mimesniff.spec.whatwg.org/#parsing-a-mime-type
   * 
   * @param text 文字列
   * @returns 生成したインスタンス
   */
  static fromString(text: string): MediaType {
    const trimmedText = StringUtils.trim(text, HTTP_WHITESPACE);

    let work = trimmedText;
    let i = 0;

    // [mimesniff 4.4.]-1,2 削除済

    // [mimesniff 4.4.]-3
    const { component: typeName, progression: typeNameLength } = parseTypeName(work);
    if (typeNameLength <= 0) {
      throw new TypeError("typeName");
    }

    // [mimesniff 4.4.]-4,5 はコンストラクターではじかれる

    // [mimesniff 4.4.]-6
    work = work.substring(typeNameLength + 1);
    i = i + typeNameLength + 1;

    // [mimesniff 4.4.]-7,8
    const { component: subtypeName, progression: subtypeNameEnd, parseEnd } = parseSubtypeName(work);
    work = (parseEnd === true) ? "" : work.substring(subtypeNameEnd);
    i = i + subtypeNameEnd;

    // [mimesniff 4.4.]-9 はコンストラクターではじかれる

    // [mimesniff 4.4.]-10 はコンストラクターで行う

    if (work.length <= 0) {
      return new MediaType(typeName, subtypeName, [], trimmedText.substring(0, i));
    }

    // [mimesniff 4.4.]-11
    const parameterEntries: Array<[ string, string ]> = [];
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
        const { value, length } = StringUtils.collectHttpQuotedStringStart(work);
        work = work.substring(length);
        i = i + length;
        parameterValue = value;

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
        parameterValue = StringUtils.trimEnd(parameterValue, HTTP_WHITESPACE);

        // [mimesniff 4.4.]-11.9.3
        if (parameterValue.length <= 0) {
          continue;
        }
      }

      // [mimesniff 4.4.]-11.10
      if (parameterName.length <= 0) {
        continue;
      }
      if (StringUtils.match(parameterName, HTTP_TOKEN) !== true) {
        continue;
      }
      if (StringUtils.match(parameterValue, HTTP_QUOTED_STRING_TOKEN) !== true) {
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

  /**
   * 文字列表現を生成し返却
   * 
   * @override
   * @returns 文字列表現
   */
  toString(): string {
    const parameterNames = [ ...this.#parameters.keys() ].sort();
    let parameters = "";
    for (const parameterName of parameterNames) {
      parameters = parameters + ";" + parameterName + "=";

      const parameterValue = this.#parameters.get(parameterName) as string;
      if (StringUtils.match(parameterValue, HTTP_TOKEN) !== true) {
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
   * 文字列表現を生成し返却
   * 
   * @returns 文字列表現
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * パラメーターを入れ替えた新たなインスタンスを生成し返却
   * 
   * @param parameterEntries パラメーターのエントリーの配列
   * @returns 生成したインスタンス
   */
  withParameters(parameterEntries: Array<[ string, string ]>): MediaType {
    return new MediaType(this.#typeName, this.#subtypeName, parameterEntries);
  }

  /**
   * パラメーターを取り除いた新たなインスタンスを生成し返却
   * 
   * @returns 生成したインスタンス
   */
  withoutParameters(): MediaType {
    return new MediaType(this.#typeName, this.#subtypeName);
  }
}
Object.freeze(MediaType);