export interface GlobEnvConfig {
	// 标题
	VITE_GLOB_APP_TITLE: string;
	// 接口地址
	VITE_GLOB_SERVER_BASEURL: string;
	// 接口前缀
	VITE_GLOB_API_PREFIX: string;
	// 网站公共路径
	VITE_GLOB_APP_PUBLIC_BASE: string;
	// 项目简称
	VITE_GLOB_APP_SHORT_NAME: string;
	// 微信小程序的 APPID
	VITE_GLOB_WX_APPID: string;
	// Token key
	VITE_GLOB_TOKEN_KEY: string;
	// Token prefix
	VITE_GLOB_TOKEN_PREFIX: string;
}

export interface GlobConfig {
	// 标题
	title: string;
	// 接口地址
	baseUrl: string;
	// api 接口前缀
	urlPrefix: string;
	// 网站公共路径
	publicPath: string;
	// 项目简称
	shortName: string;
	// 微信小程序的 APPID
	wxAppid: string;
	// Token key
	tokenKey: string;
	// Token prefix
	tokenPrefix: string;
}
