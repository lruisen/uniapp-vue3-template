import _function from './function';

const $u = {
	..._function, // 引入函数工具
};

uni.$u = $u;

export const tools = {
	install(app) {
		app.config.globalProperties.$u = $u; // 挂在到全局属性，方便在模板中直接使用
	},
};
