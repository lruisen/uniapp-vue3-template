import { pages } from '@/pages.json';

const tabBar = {
  list: [],
};

const subPackages: any[] = [];

const getLastPage = () => {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
};

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = () => {
  if (!tabBar) {
    return false;
  }
  if (!tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return false;
  }

  const lastPage = getLastPage();
  const currPath = lastPage.route;
  return !!tabBar.list.find((e: any) => e.pagePath === currPath);
};

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
  const lastPage = getLastPage();
  const currRoute = (lastPage as any).$page;
  const { fullPath } = currRoute as { fullPath: string };
  return getUrlObj(fullPath);
};

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url));
  }
  return url;
};
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  const [path, queryStr] = url.split('?');

  if (!queryStr) {
    return {
      path,
      query: {},
    };
  }

  const query: Record<string, string> = {};
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=');
    query[key] = ensureDecodeURIComponent(value); // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  });

  return { path, query };
};

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page: any) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ];

  // 这里处理分包
  const subPages: any[] = [];
  subPackages.forEach((subPageObj: any) => {
    const { root } = subPageObj;

    subPageObj.pages
      .filter((page: any) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        });
      });
  });

  return [...mainPages, ...subPages];
};

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path);

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path);
