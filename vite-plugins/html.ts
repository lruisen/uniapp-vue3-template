import type { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import pkg from '../package.json';

export const configHtmlPlugin = (env: any, isBuild: boolean) => {
	const { VITE_GLOB_APP_TITLE, VITE_GLOB_APP_PUBLIC_BASE } = env;

	const path = VITE_GLOB_APP_PUBLIC_BASE.endsWith('/') ? VITE_GLOB_APP_PUBLIC_BASE : `${VITE_GLOB_APP_PUBLIC_BASE}/`;

	const getAppConfigSrc = () => {
		return `${path || '/'}app.config.js?v=${pkg.version}-${new Date().getTime()}`;
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
