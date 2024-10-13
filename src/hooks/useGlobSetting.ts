import type { GlobConfig } from '/#/config';
import { getAppEnvConfig } from '@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    // 标题
    VITE_GLOB_APP_TITLE,
    // 接口地址
    VITE_GLOB_SERVER_BASEURL,
    // 接口前缀
    VITE_GLOB_API_PREFIX,
    // 网站公共路径
    VITE_GLOB_APP_PUBLIC_BASE,
    // 项目简称
    VITE_GLOB_APP_SHORT_NAME,
    // 微信小程序的 APPID
    VITE_GLOB_WX_APPID,
    // Token key
    VITE_GLOB_TOKEN_KEY,
    // Token prefix
    VITE_GLOB_TOKEN_PREFIX,
  } = getAppEnvConfig();

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    console.warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    // 标题
    title: VITE_GLOB_APP_TITLE,
    // 接口地址
    baseUrl: VITE_GLOB_SERVER_BASEURL,
    // api 接口前缀
    urlPrefix: VITE_GLOB_API_PREFIX,
    // 网站公共路径
    publicPath: VITE_GLOB_APP_PUBLIC_BASE,
    // 项目简称
    shortName: VITE_GLOB_APP_SHORT_NAME,
    // 微信小程序的 APPID
    wxAppid: VITE_GLOB_WX_APPID,
    // Token key
    tokenKey: VITE_GLOB_TOKEN_KEY,
    // Token prefix
    tokenPrefix: VITE_GLOB_TOKEN_PREFIX,
  };

  return glob as Readonly<GlobConfig>;
};
