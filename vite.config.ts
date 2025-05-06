import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImport from 'unplugin-auto-import/vite';
import path from 'node:path';
import { configHtmlPlugin } from './vite-plugins/html';
import UniManifest from '@uni-helper/vite-plugin-uni-manifest';
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts';
import { wrapperEnv } from './scripts/utils';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode, command }: ConfigEnv): Promise<UserConfig> => {
	const UnoCSS = await import('unocss/vite').then((i) => i.default);

	// mode: 区分生产环境还是开发环境
	console.log('command, mode -> ', command, mode);
	// pnpm dev:h5 时得到 => serve development
	// pnpm build:h5 时得到 => build production
	// pnpm dev:mp-weixin 时得到 => build development (注意区别，command为build)
	// pnpm build:mp-weixin 时得到 => build production
	// pnpm dev:app 时得到 => build development (注意区别，command为build)
	// pnpm build:app 时得到 => build production
	// dev 和 build 命令可以分别使用 .env.development 和 .env.production 的环境变量

	const { UNI_PLATFORM } = process.env;
	const isBuild = command === 'build';

	const env = loadEnv(mode, process.cwd());
	const viteEnv = wrapperEnv(env);

	const { VITE_GLOB_PUBLIC_PATH, VITE_APP_PORT, VITE_SHOW_SOURCEMAP, VITE_DELETE_CONSOLE, VITE_APP_PROXY } = viteEnv;

	return {
		base: VITE_GLOB_PUBLIC_PATH,
		plugins: [
			UniLayouts(),
			UniManifest(),
			uni(),
			UnoCSS(),
			AutoImport({
				imports: ['vue', 'uni-app'],
				dts: './src/types/auto-import.d.ts',
				dirs: [], // 自动导入文件夹中的内容
				eslintrc: { enabled: true },
				vueTemplate: true, // default false
			}),
			UNI_PLATFORM === 'h5' && configHtmlPlugin(env, isBuild),
		],
		define: {
			// 定义 uniapp 运行的平台为常量
			__UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
			__VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY),
		},
		resolve: {
			alias: {
				'@/': path.join(process.cwd(), './src/'),
				'/#/': path.join(process.cwd(), './src/types/'),
			},
		},
		// 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
		server: {
			hmr: true,
			host: '0.0.0.0',
			port: VITE_APP_PORT,
		},
		build: {
			// 方便非h5端调试
			target: 'es6',
			// 开发环境不用压缩
			minify: mode === 'development' ? false : 'terser',
			sourcemap: VITE_SHOW_SOURCEMAP, // App，小程序端源码调试需要开启 sourcemap
			terserOptions: {
				compress: {
					drop_console: VITE_DELETE_CONSOLE, // 删除 console
					drop_debugger: true, // 删除 debugger
				},
			},
			rollupOptions: {
				output: {
					// 此配置只对 H5 打包生效
					assetFileNames: (assetInfo: any): string => {
						if (assetInfo.name.endsWith('.css')) {
							return `css/[name]-[hash].css`;
						}

						const imgExt: string[] = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];
						if (imgExt.some((ext: string) => assetInfo.name.endsWith(ext))) {
							return `images/[name]-[hash].[ext]`;
						}

						return `assets/[name]-[hash].[ext]`;
					},
				},
			},
		},
	};
});
