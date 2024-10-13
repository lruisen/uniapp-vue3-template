//import pkg from '../package.json';
import type { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
//import { GLOB_CONFIG_FILE_NAME } from '../src/utils';

export const configHtmlPlugin = (env: any, isBuild: boolean) => {
	const { VITE_GLOB_APP_TITLE, VITE_GLOB_APP_PUBLIC_BASE } = env;

	const path = VITE_GLOB_APP_PUBLIC_BASE.endsWith('/') ? VITE_GLOB_APP_PUBLIC_BASE : `${VITE_GLOB_APP_PUBLIC_BASE}/`;

	const getAppConfigSrc = () => {
		return `${path || '/'}app.config.js?v=1.0-${new Date().getTime()}`;
	};

	const htmlPlugin: PluginOption[] = createHtmlPlugin({
		minify: isBuild,
		inject: {
			// Inject data into ejs template
			data: {
				title: VITE_GLOB_APP_TITLE,
			},
			// Embed the generated app.config.js file
			tags: isBuild
				? [
						{
							tag: 'script',
							attrs: {
								src: getAppConfigSrc(),
							},
						},
				  ]
				: [],
		},
	});
	return htmlPlugin;
};
