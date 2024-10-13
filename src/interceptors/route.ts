import { useUserStore } from '@/store/modules/user';
import { getNeedLoginPages, needLoginPages as _needLoginPages } from '@/utils/route';

interface InvokeOptions {
  url: string;
}

// TODO Check
const loginRoute = '/pages/login/index';

// 是否已经登录
const isLogined = () => {
  const userStore = useUserStore();
  return userStore.getIsLogined;
};

const isDev = import.meta.env.DEV;

// 登录拦截器
const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke(invokeOptions: InvokeOptions) {
    const { url } = invokeOptions;
    // console.log(url) // /pages/route-interceptor/index?name=feige&age=30
    const path = url.split('?')[0];
    let needLoginPages: string[] = [];
    // 为了防止开发时出现BUG，这里每次都获取一下。生产环境可以移到函数外，性能更好
    needLoginPages = isDev ? getNeedLoginPages() : _needLoginPages;
    if (!needLoginPages.includes(path) || isLogined()) {
      return true;
    }

    const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`;
    uni.navigateTo({ url: redirectRoute });
    return false;
  },
};

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor);
    uni.addInterceptor('reLaunch', navigateToInterceptor);
    uni.addInterceptor('redirectTo', navigateToInterceptor);
  },
};
