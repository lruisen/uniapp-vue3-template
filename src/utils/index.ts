import { isArray } from './is';

/**
 * 将URL路径参数转为对象
 * @param {String} url 路径参数
 */
export const urlToObj = (url: string) => {
  return url.split('&').reduce((obj: Recordable, item) => {
    const [key, value] = item.split('=');
    obj[key] = value;
    return obj;
  }, {});
};

/**
 * 将对象转为URL路径参数
 * @param {Object} obj 对象
 */
export const objToUrl = (obj: Recordable) => {
  return Object.keys(obj).reduce((str, key) => {
    str += `${key}=${obj[key]}&`;
    return str;
  }, '');
};

/**
 * 解析URL Query参数，此函数仅在 H5 中有效
 * 主要针对 Hash 和 History 路由模式
 */
export const parseQuery = () => {
  const res: Recordable = {};

  try {
    const query = (location.href.split('?')[1] || '').trim().replace(/^(\?|#|&)/, '');
    if (!query) {
      return res;
    }

    query.split('&').forEach((param) => {
      const parts = param.replace(/\+/g, ' ').split('=');
      const key = decodeURIComponent(parts.shift() as string);
      const val = parts.length > 0 ? decodeURIComponent(parts.join('=')) : null;

      if (res[key] === undefined) {
        res[key] = val;
      } else if (isArray(res[key])) {
        res[key].push(val);
      } else {
        res[key] = [res[key], val];
      }
    });
  } catch (error) {
    console.error('Error parsing query:', error);
  }

  return res;
};

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
export const deepClone = (obj) => {
  // 对常见的“非”值，直接返回原来值
  if ([null, undefined, NaN, false].includes(obj)) return obj;
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    // 原始类型直接返回
    return obj;
  }

  const o = isArray(obj) ? [] : {};
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
    }
  }

  return o;
};

/**
 * 递归合并两个对象。
 * @param targetOrigin The targetOrigin object to merge from. 要合并的源对象。
 * @param source The source object to merge into. 目标对象，合并后结果存放于此。
 * @returns The merged object. 合并后的对象。
 */
export const deepMerge = (targetOrigin = {}, source = {}) => {
  let target = deepClone(targetOrigin);
  if (typeof target !== 'object' || typeof source !== 'object') return false;
  for (const prop in source) {
    if (!source.hasOwnProperty(prop)) continue;
    if (prop in target) {
      if (source[prop] == null) {
        target[prop] = source[prop];
      } else if (typeof target[prop] !== 'object') {
        target[prop] = source[prop];
      } else if (typeof source[prop] !== 'object') {
        target[prop] = source[prop];
      } else if (target[prop].concat && source[prop].concat) {
        target[prop] = target[prop].concat(source[prop]);
      } else {
        target[prop] = deepMerge(target[prop], source[prop]);
      }
    } else {
      target[prop] = source[prop];
    }
  }

  return target;
};
