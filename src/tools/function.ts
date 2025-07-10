import test from './test';
import { round } from './digit';

/**
 * @description 去除空格
 * @param String str 需要去除空格的字符串
 * @param String pos both(左右)|left|right|all 默认both
 */
const trim = (str, pos = 'both') => {
	str = String(str);
	if (pos == 'both') {
		return str.replace(/^\s+|\s+$/g, '');
	}
	if (pos == 'left') {
		return str.replace(/^\s*/, '');
	}
	if (pos == 'right') {
		return str.replace(/(\s*$)/g, '');
	}
	if (pos == 'all') {
		return str.replace(/\s+/g, '');
	}
	return str;
};

/**
 * @description 进行延时，以达到可以简写代码的目的 比如: await uni.$u.sleep(20)将会阻塞20ms
 * @param {number} value 堵塞时间 单位ms 毫秒
 * @returns {Promise} 返回promise
 */
const sleep = (value = 30) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, value);
	});
};

/**
 * @description 运行期判断平台
 * @returns {string} 返回所在平台(小写)
 * @link 运行期判断平台 https://uniapp.dcloud.io/frame?id=判断平台
 */
const os = () => {
	return uni.getSystemInfoSync().platform.toLowerCase();
};

/**
 * @description 获取系统信息同步接口
 * @link 获取系统信息同步接口 https://uniapp.dcloud.io/api/system/info?id=getsysteminfosync
 */
const sys = () => {
	return uni.getSystemInfoSync();
};

/**
 * @description 取一个区间数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
const random = (min, max) => {
	if (min >= 0 && max > 0 && max >= min) {
		const gab = max - min + 1;
		return Math.floor(Math.random() * gab + min);
	}
	return 0;
};

/**
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
function guid(len = 32, firstU = true, radix = null) {
	const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	const uuid = [];
	radix = radix || chars.length;

	if (len) {
		// 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
		for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
	} else {
		let r;
		// rfc4122标准要求返回的uuid中,某些位为固定的字符
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		for (let i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | (Math.random() * 16);
				uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	// 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
	if (firstU) {
		uuid.shift();
		return `u${uuid.join('')}`;
	}
	return uuid.join('');
}

/**
 * @description 样式转换
 * 对象转字符串，或者字符串转对象
 * @param {object | string} customStyle 需要转换的目标
 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
 * @returns {object|string}
 */
const addStyle = (customStyle, target = 'object') => {
	// 字符串转字符串，对象转对象情形，直接返回
	if (
		test.empty(customStyle) ||
		(typeof customStyle === 'object' && target === 'object') ||
		(target === 'string' && typeof customStyle === 'string')
	) {
		return customStyle;
	}
	// 字符串转对象
	if (target === 'object') {
		// 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
		customStyle = trim(customStyle);
		// 根据";"将字符串转为数组形式
		const styleArray = customStyle.split(';');
		const style = {};
		// 历遍数组，拼接成对象
		for (let i = 0; i < styleArray.length; i++) {
			// 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
			if (styleArray[i]) {
				const item = styleArray[i].split(':');
				style[trim(item[0])] = trim(item[1]);
			}
		}
		return style;
	}
	// 这里为对象转字符串形式
	let string = '';
	for (const i in customStyle) {
		// 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
		const key = i.replace(/([A-Z])/g, '-$1').toLowerCase();
		string += `${key}:${customStyle[i]};`;
	}
	// 去除两端空格
	return trim(string);
};

/**
 * @description 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
 * @param {string|number} value 需要添加单位的值
 * @param {string} unit 添加的单位名 比如px
 */
const addUnit = (value = 'auto', unit = uni?.$u?.config?.unit ?? 'px') => {
	value = String(value);
	// 用内置验证规则中的number判断是否为数值
	return test.number(value) ? `${value}${unit}` : value;
};

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @param cache 缓存
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
const deepClone = (obj, cache = new WeakMap()) => {
	if (obj === null || typeof obj !== 'object') return obj;
	if (cache.has(obj)) return cache.get(obj);
	let clone;
	if (obj instanceof Date) {
		clone = new Date(obj.getTime());
	} else if (obj instanceof RegExp) {
		clone = new RegExp(obj);
	} else if (obj instanceof Map) {
		clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value, cache)]));
	} else if (obj instanceof Set) {
		clone = new Set(Array.from(obj, (value) => deepClone(value, cache)));
	} else if (Array.isArray(obj)) {
		clone = obj.map((value) => deepClone(value, cache));
	} else if (Object.prototype.toString.call(obj) === '[object Object]') {
		clone = Object.create(Object.getPrototypeOf(obj));
		cache.set(obj, clone);
		for (const [key, value] of Object.entries(obj)) {
			clone[key] = deepClone(value, cache);
		}
	} else {
		clone = Object.assign({}, obj);
	}
	cache.set(obj, clone);
	return clone;
};

/**
 * @description JS对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
const deepMerge = (target = {}, source = {}) => {
	target = deepClone(target);
	if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) return target;
	const merged = Array.isArray(target) ? target.slice() : Object.assign({}, target);
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue;
		const sourceValue = source[prop];
		const targetValue = merged[prop];
		if (sourceValue instanceof Date) {
			merged[prop] = new Date(sourceValue);
		} else if (sourceValue instanceof RegExp) {
			merged[prop] = new RegExp(sourceValue);
		} else if (sourceValue instanceof Map) {
			merged[prop] = new Map(sourceValue);
		} else if (sourceValue instanceof Set) {
			merged[prop] = new Set(sourceValue);
		} else if (typeof sourceValue === 'object' && sourceValue !== null) {
			merged[prop] = deepMerge(targetValue, sourceValue);
		} else {
			merged[prop] = sourceValue;
		}
	}
	return merged;
};

/**
 * @description error提示
 * @param {*} err 错误内容
 */
const error = (err) => {
	// 开发环境才提示，生产环境不会提示
	if (process.env.NODE_ENV === 'development') {
		console.error(`❌❌❌：${err}`);
	}
};

// padStart 的 polyfill，因为某些机型或情况，还无法支持es7的padStart，比如电脑版的微信小程序
// 所以这里做一个兼容polyfill的兼容处理
if (!String.prototype.padStart) {
	// 为了方便表示这里 fillString 用了ES6 的默认参数，不影响理解
	String.prototype.padStart = function (maxLength, fillString = ' ') {
		if (Object.prototype.toString.call(fillString) !== '[object String]') {
			throw new TypeError('fillString must be String');
		}
		const str = this;
		// 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
		if (str.length >= maxLength) return String(str);

		const fillLength = maxLength - str.length;
		let times = Math.ceil(fillLength / fillString.length);
		while ((times >>= 1)) {
			fillString += fillString;
			if (times === 1) {
				fillString += fillString;
			}
		}
		return fillString.slice(0, fillLength) + str;
	};
}

/**
 * @description 对象转url参数
 * @param {object} data,对象
 * @param {Boolean} isPrefix,是否自动加上"?"
 * @param {string} arrayFormat 规则 indices|brackets|repeat|comma
 */
const queryParams = (data = {}, isPrefix = true, arrayFormat = 'brackets') => {
	const prefix = isPrefix ? '?' : '';
	const _result = [];
	if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
	for (const key in data) {
		const value = data[key];
		// 去掉为空的参数
		if (['', undefined, null].indexOf(value) >= 0) {
			continue;
		}
		// 如果值为数组，另行处理
		if (value.constructor === Array) {
			// e.g. {ids: [1, 2, 3]}
			switch (arrayFormat) {
				case 'indices':
					// 结果: ids[0]=1&ids[1]=2&ids[2]=3
					for (let i = 0; i < value.length; i++) {
						_result.push(`${key}[${i}]=${value[i]}`);
					}
					break;
				case 'brackets':
					// 结果: ids[]=1&ids[]=2&ids[]=3
					value.forEach((_value) => {
						_result.push(`${key}[]=${_value}`);
					});
					break;
				case 'repeat':
					// 结果: ids=1&ids=2&ids=3
					value.forEach((_value) => {
						_result.push(`${key}=${_value}`);
					});
					break;
				case 'comma':
					// 结果: ids=1,2,3
					let commaStr = '';
					value.forEach((_value) => {
						commaStr += (commaStr ? ',' : '') + _value;
					});
					_result.push(`${key}=${commaStr}`);
					break;
				default:
					value.forEach((_value) => {
						_result.push(`${key}[]=${_value}`);
					});
			}
		} else {
			_result.push(`${key}=${value}`);
		}
	}
	return _result.length ? prefix + _result.join('&') : '';
};

/**
 * 显示消息提示框
 * @param {String} title 提示的内容，长度与 icon 取值有关。
 * @param {Number} duration 提示的延迟时间，单位毫秒，默认：2000
 */
const toast = (title, duration = 2000) => {
	uni.showToast({
		title: String(title),
		icon: 'none',
		duration,
	});
};

/**
 * @description 数字格式化
 * @param {number|string} number 要格式化的数字
 * @param {number} decimals 保留几位小数
 * @param {string} decimalPoint 小数点符号
 * @param {string} thousandsSeparator 千分位符号
 * @returns {string} 格式化后的数字
 */
const priceFormat = (number, decimals = 0, decimalPoint = '.', thousandsSeparator = ',') => {
	number = `${number}`.replace(/[^0-9+-Ee.]/g, '');
	const n = !isFinite(+number) ? 0 : +number;
	const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
	const sep = typeof thousandsSeparator === 'undefined' ? ',' : thousandsSeparator;
	const dec = typeof decimalPoint === 'undefined' ? '.' : decimalPoint;
	let s = [];

	s = (prec ? round(n, prec) + '' : `${Math.round(n)}`).split('.');
	const re = /(-?\d+)(\d{3})/;
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, `$1${sep}$2`);
	}

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
};

/**
 * @description 获取某个对象下的属性，用于通过类似'a.b.c'的形式去获取一个对象的的属性的形式
 * @param {object} obj 对象
 * @param {string} key 需要获取的属性字段
 * @returns {*}
 */
const getProperty = (obj, key) => {
	if (!obj) {
		return;
	}
	if (typeof key !== 'string' || key === '') {
		return '';
	}
	if (key.indexOf('.') !== -1) {
		const keys = key.split('.');
		let firstObj = obj[keys[0]] || {};

		for (let i = 1; i < keys.length; i++) {
			if (firstObj) {
				firstObj = firstObj[keys[i]];
			}
		}
		return firstObj;
	}
	return obj[key];
};

/**
 * @description 设置对象的属性值，如果'a.b.c'的形式进行设置
 * @param {object} obj 对象
 * @param {string} key 需要设置的属性
 * @param {string} value 设置的值
 */
const setProperty = (obj, key, value) => {
	if (!obj) {
		return;
	}
	// 递归赋值
	const inFn = function (_obj, keys, v) {
		// 最后一个属性key
		if (keys.length === 1) {
			_obj[keys[0]] = v;
			return;
		}
		// 0~length-1个key
		while (keys.length > 1) {
			const k = keys[0];
			if (!_obj[k] || typeof _obj[k] !== 'object') {
				_obj[k] = {};
			}
			const key = keys.shift();
			// 自调用判断是否存在属性，不存在则自动创建对象
			inFn(_obj[k], keys, v);
		}
	};

	if (typeof key !== 'string' || key === '') {
	} else if (key.indexOf('.') !== -1) {
		// 支持多层级赋值操作
		const keys = key.split('.');
		inFn(obj, keys, value);
	} else {
		obj[key] = value;
	}
};

export default {
	trim,
	sleep,
	os,
	sys,
	random,
	guid,
	addStyle,
	addUnit,
	deepClone,
	deepMerge,
	error,
	queryParams,
	toast,
	priceFormat,
	getProperty,
	setProperty
};
