import { getConfigFileName, getEnvConfig, getRootPath, GLOB_CONFIG_FILE_NAME } from '../scripts/utils';
import fs, { writeFileSync } from 'fs-extra';
import pkg from '../package.json';
import type { Plugin } from 'vite';

interface BuildConfigPluginOptions {
	output?: string;
}

interface CreateConfigOptions {
	configName: string;
	config: any;
	configFileName?: string;
	output?: string;
}

function createConfig(options: CreateConfigOptions) {
	const { configFileName, output } = options;
	const OUTPUT_DIR = output === 'h5' ? 'dist/build/h5' : `src`;
	let configFile = output === 'h5' ? configFileName?.replace('.ts', '.js') : configFileName;

	try {
		let configStr = getConfigStr(options);
		fs.mkdirp(getRootPath(OUTPUT_DIR));
		writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFile}`), configStr);
		console.log(`✨ [${pkg.name}] - configuration file is build successfully: ${OUTPUT_DIR + '/' + configFile} \n`);
	} catch (error) {
		console.log(`configuration file configuration file failed to package:\n ${error}`);
	}
}

function getConfigStr(options: CreateConfigOptions) {
	const { configName, config, output } = options;
	let configStr;
	if (output === 'h5') {
		const windowConf = `window.${configName}`;
		configStr = `${windowConf}=${JSON.stringify(config)};`;
		configStr +=
			`\n      Object.freeze(${windowConf});\n      Object.defineProperty(window, "${configName}", {\n        configurable: false,\n        writable: false,\n      });\n    `.replace(
				/\s/g,
				''
			);
	} else {
		const windowConf = `uni.${configName}`;
		configStr = `export const loadEnvConfig = () => {\n  ${windowConf} = ${JSON.stringify(config).replace(
			/\s/g,
			''
		)};\n  Object.freeze(${windowConf});\n  Object.defineProperty(uni, '${configName}', {\n    configurable: false,\n    writable: false,\n  });\n};`;
	}
	return configStr;
}

export function buildConfigPlugin(options: BuildConfigPluginOptions = {}): Plugin {
	return {
		name: 'vite-plugin-build-config',
		apply: 'build',
		async buildStart() {
			const config = getEnvConfig();
			const configFileName = getConfigFileName(config);
			createConfig({
				config,
				configName: configFileName,
				configFileName: GLOB_CONFIG_FILE_NAME,
				output: options.output,
			});
		},
	};
}
