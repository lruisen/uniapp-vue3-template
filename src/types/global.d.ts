export {};

/**
 * 声明全局需要的类型
 */
declare global {
	interface ImportMeta {
		readonly env: Record<string, string>;
		readonly glob: Record<function>;
	}

	declare type Recordable<T = any> = Record<string, T>;

	// vue
	declare type PropType<T> = VuePropType<T>;
}
