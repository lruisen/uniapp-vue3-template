import pkg from '../package.json';
import { getConfigFileName, getEnvConfig, getRootPath, GLOB_CONFIG_FILE_NAME } from './utils';
import fs, { writeFileSync } from 'fs-extra';

interface CreateConfigOptions {
	configName: string;
	config: any;
	configFileName?: string;
	output?: string;
}

const runBuild = () => {
	try {
		const argvList = process.argv.splice(2);

		if (!argvList.includes('disabled-config')) {
			let output = argvList.filter((item) => item.startsWith('--output=')).shift();
			output = output ? output.replace('--output=', '') : '';
			runBuildConfig(output);
		}

		console.log(`[${GLOB_CONFIG_FILE_NAME}]  - build successfully!`);
	} catch (error) {
		console.log(`vite build error:\n ${error}`);
		process.exit(1);
	}
};

const runBuildConfig = (output: string) => {
	const config = getEnvConfig();
	const configFileName = getConfigFileName(config);
	createConfig({
		config,
		configName: configFileName,
		configFileName: GLOB_CONFIG_FILE_NAME,
		output,
	});
};

const createConfig = (options: CreateConfigOptions) => {
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
};

const getConfigStr = (options: CreateConfigOptions) => {
	const { configName, config, output } = options;

	let configStr;
	if (output === 'h5') {
		const windowConf = `window.${configName}`;
		configStr = `${windowConf}=${JSON.stringify(config)};`;
		configStr += `
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '');
	} else {
		const windowConf = `uni.${configName}`;
		configStr = `export const loadEnvConfig = () => {
  ${windowConf} = ${JSON.stringify(config).replace(/\s/g, '')};
  Object.freeze(${windowConf});
  Object.defineProperty(uni, '${configName}', {
    configurable: false,
    writable: false,
  });
};`;
	}

	return configStr;
};

runBuild();
