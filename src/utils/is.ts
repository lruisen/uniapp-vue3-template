const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined';
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object');
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window');
}

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export function isHttpUrl(path: string): boolean {
  const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
  return reg.test(path);
}

/**
 * 判断字符串是否为PascalCase格式
 *
 * PascalCase（帕斯卡大小写）是一种命名约定，每个单词的首字母大写，没有空格或标点符号
 * 此函数用于验证给定的字符串是否符合PascalCase的命名规则
 *
 * @param str 要检查的字符串
 * @returns 如果字符串是PascalCase格式，则返回true；否则返回false
 */
export function isPascalCase(str: string): boolean {
  const regex = /^[A-Z][A-Za-z]*$/;
  return regex.test(str);
}

/**
 * @description:  是否为函数
 */
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, 'Function');
}

/**
 * 判断是否 url
 * */
export function isUrl(url: string) {
  return /^(http|https):\/\//g.test(url);
}
