import { createSSRApp } from 'vue';
import App from './App.vue';
import store from './store';
import { prototypeInterceptor, routeInterceptor } from './interceptors';

// 引入 unocss
import 'uno.css';

// 非 H5 环境下，将全局环境变量加载到 uni 全局对象中
// #ifndef H5
import { loadEnvConfig } from './app.config';
loadEnvConfig();
// #endif
export function createApp() {
  const app = createSSRApp(App);

  app.use(store);
  app.use(prototypeInterceptor);
  app.use(routeInterceptor);

  return {
    app,
  };
}
