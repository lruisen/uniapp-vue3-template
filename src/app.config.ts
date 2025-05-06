export const loadEnvConfig = () => {
  uni.__PRODUCTION__APP__CONF__ = {"VITE_GLOB_APP_TITLE":"uniapp","VITE_GLOB_WX_APPID":"","VITE_GLOB_APP_PUBLIC_BASE":"./","VITE_GLOB_SERVER_BASEURL":"https://ukw0y1.laf.run","VITE_GLOB_API_PREFIX":"/api","VITE_GLOB_TOKEN_KEY":"Authorization","VITE_GLOB_TOKEN_PREFIX":"Bearer"};
  Object.freeze(uni.__PRODUCTION__APP__CONF__);
  Object.defineProperty(uni, '__PRODUCTION__APP__CONF__', {
    configurable: false,
    writable: false,
  });
};