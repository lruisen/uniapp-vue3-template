import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * 全局配置文件名
 */
export const GLOB_CONFIG_FILE_NAME = 'app.config.ts';

/**
 * 获取全局配置文件名
 * @param env 环境变量
 * @returns 全局配置文件名
 */
export const getConfigFileName = (env: Record<string, any>) => {
	return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || 'APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
};

/**
 * 获取环境变量文件
 * @returns 环境变量文件
 */
export const getEnvFiles = () => {
	const script = process.env.npm_lifecycle_script;
	const reg = new RegExp('--mode ([a-z_\\d]+)');
	const result = reg.exec(script as string) as any;
	if (result) {
		const mode = result[1] as string;
		return ['.env', `.env.${mode}`];
	}

	return ['.env', '.env.production'];
};

/**
 * 获取环境变量配置
 * @param match 匹配的环境变量前缀
 * @param confFiles 环境变量文件
 * @returns
 */
export const getEnvConfig = (match = 'VITE_GLOB', confFiles = getEnvFiles()) => {
	let envConfig = {};
	confFiles.forEach((item) => {
		try {
			const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
			envConfig = { ...envConfig, ...env };
		} catch (e) {
			console.error(`Error in parsing ${item}`, e);
		}
	});
	const reg = new RegExp(`^(${match})`);
	Object.keys(envConfig).forEach((key) => {
		if (!reg.test(key)) {
			Reflect.deleteProperty(envConfig, key);
		}
	});
	return envConfig;
};

/**
 * Get user root directory
 * @param dir file path
 */
export const getRootPath = (...dir: string[]) => {
	return path.resolve(process.cwd(), ...dir);
};

/**
 * Env 环境变量包装器
 * @param envConf 环境变量配置
 * @returns 环境变量配置
 */
export function wrapperEnv(envConf: Record<string, any>) {
	const ret: Record<string, any> = {};

	Object.entries(envConf).forEach(([envName, value]) => {
		let realValue = value.replace(/\\n/g, '\n');

		// 转换布尔值
		if (realValue === 'true') {
			realValue = true;
		} else if (realValue === 'false') {
			realValue = false;
		}

		// 转换端口号为数字
		if (envName === 'VITE_PORT') {
			realValue = Number(realValue);
		}

		// 解析代理配置
		if (envName === 'VITE_PROXY' && realValue) {
			try {
				realValue = JSON.parse(realValue.replace(/'/g, '"'));
			} catch {
				realValue = '';
			}
		}

		ret[envName] = realValue;

		// 设置到 process.env
		if (typeof realValue === 'object') {
			process.env[envName] = JSON.stringify(realValue);
		} else {
			process.env[envName] = String(realValue);
		}
	});

	return ret;
}
