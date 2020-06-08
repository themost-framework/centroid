// MOST Web Framework Centroid for Deno Copyright (c) 2020,
// THEMOST LP All rights reserved BSD-3-Clause license
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const DateTimeRegex = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/g;
export class LangUtils {
  /**
   * Returns an array of strings which represents the argument names of the given function
   * @param {Function} func
   */
  static getFunctionArgumentNames(func: Function) {
    // validate parameter type
    if (typeof func !== "function") {
      return [];
    }
    let funcStr = func.toString().replace(STRIP_COMMENTS, "");
    let result = funcStr
      .slice(funcStr.indexOf("(") + 1, funcStr.indexOf(")"))
      .match(/([^\s,]+)/g);
    if (result === null) {
      result = [];
    }
    return result;
  }
  /**
   * Checks if the given value is a valid date
   * @param {*} value
   * @returns {boolean}
   */
  static isDate(value: any): boolean {
    if (value instanceof Date) {
      return true;
    }
    return DateTimeRegex.test(value);
  }
}
