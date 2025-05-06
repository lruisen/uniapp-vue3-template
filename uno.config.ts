import { presetWeapp } from 'unocss-preset-weapp';
import { extractorAttributify, transformerClass } from 'unocss-preset-weapp/transformer';

const { presetWeappAttributify, transformerAttributify } = extractorAttributify();

export default {
	presets: [
		// https://github.com/MellowCo/unocss-preset-weapp
		presetWeapp(),
		// attributify autocomplete
		presetWeappAttributify(),
	],
	shortcuts: [
		['border-base', 'border border-gray-500_10'],
		['flex-center', 'flex justify-center items-center'],
	],

	transformers: [
		// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
		transformerAttributify(),

		// https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
		transformerClass(),
	],

	rules: [
		[
			'p-safe',
			{
				padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
			},
		],
		['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
		['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
	],
};
