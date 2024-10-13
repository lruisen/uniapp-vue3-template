import type { HttpCustom, HttpError, HttpRequestConfig, HttpResponse } from 'luch-request';
import Request from 'luch-request';
import type { RequestTransform } from './RequestTransform';
import { isFunction, isUrl } from '@/utils/is';
import { deepMerge } from '@/utils';
import { ContentTypeEnum, ResultCodeEnum } from '@/utils/http/HttpEnum';
import storage from '@/utils/storage';
import { ACCESS_TOKEN } from '@/enums/common';
import type { ResponseData } from '@/utils/http/types';
import { useGlobSetting } from '@/hooks/useGlobSetting';

const globEnv = useGlobSetting();

const transform: RequestTransform = {
  /**
   * 请求拦截器
   * @param config
   */
  requestInterceptors: (config: HttpRequestConfig): HttpRequestConfig => {
    config.data = config.data || {};
    config.header = config.header || {};

    const { custom = {} as HttpCustom } = config;
    const { auth, isJoinPrefix } = custom;

    // 是否携带token
    if (auth) {
      const token = storage.get(ACCESS_TOKEN);
      config.header[globEnv.tokenKey] = `${globEnv.tokenPrefix} ${token}`.trim();
    }

    // 是否加入 uri 前缀
    if (!isUrl(config.url as string) && isJoinPrefix) {
      config.url = `${globEnv.urlPrefix}${config.url}`.replace(/\/+/g, '/');
    }

    return config;
  },

  /**
   * 请求拦截器错误处理
   * @param error
   */
  requestInterceptorsCatch: (error: HttpRequestConfig) => {
    return Promise.reject('网络错误，请稍后重试');
  },

  /**
   * 响应拦截器
   * @param response
   */
  responseInterceptors: (response: HttpResponse<ResponseData>): any => {
    const { custom = {} as HttpCustom } = response.config;
    const {
      isShowMessage = true,
      isReturnNativeResponse,
      isTransformResponse,
      isShowErrorMessage,
      isShowSuccessMessage,
      successMsgTxt,
      errorMsgTxt,
      errorMsgMode,
    } = custom;

    // 是否返回原生响应，在页面中得到的是一个 response 对象
    if (isReturnNativeResponse) {
      return response;
    }

    // 是否对返回数据进行处理
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return response.data;
    }

    const { data } = response;
    if (!data) {
      throw new Error('请求出错，请稍候重试');
    }

    const { code, message, data: result } = data;
    const isSuccess = data && Reflect.has(data, 'code') && code === ResultCodeEnum.SUCCESS;

    if (isShowMessage) {
      if (isSuccess && (isShowSuccessMessage || successMsgTxt)) {
        uni.showToast({ title: successMsgTxt || message || '操作成功', icon: 'none' });
      } else if (!isSuccess && (errorMsgTxt || isShowErrorMessage)) {
        uni.showToast({ title: errorMsgTxt || message || '操作失败', icon: 'none' });
      } else if (!isSuccess && errorMsgMode == 'modal') {
        uni.showModal({
          title: '提示',
          content: message,
          showCancel: false,
          confirmText: '确定',
        });
      }
    }

    if (code === ResultCodeEnum.SUCCESS) {
      return result;
    }

    let errMsg = message;
    switch (code) {
      case ResultCodeEnum.ERROR:
      case ResultCodeEnum.NO_PERMISSION:
        uni.showToast({ title: errMsg, icon: 'none' });
        break;
      case ResultCodeEnum.SERVICE_ERROR:
        uni.showModal({
          title: '警告',
          content: import.meta.env.MODE === 'development' ? errMsg : '服务异常，请稍后重试！',
          showCancel: false,
          confirmText: '确定',
        });
        break;
      case ResultCodeEnum.NO_LOGIN:
        uni.showModal({
          title: '提示',
          content: '未登录或登录已过期，请重新登录',
          showCancel: false,
          confirmText: '确定',
          success: ({ confirm }) => {
            if (confirm) {
              uni.navigateTo({ url: '/pages/login/index' });
            }
          },
        });
    }

    throw new Error(errMsg);
  },

  /**
   * 响应拦截器错误处理
   * @param error
   */
  responseInterceptorsCatch: (error: HttpError) => {
    uni.showModal({
      title: '提示',
      content: '网络异常，请稍后重试',
      showCancel: false,
      confirmText: '确定',
      success: () => {},
    });

    return Promise.reject(error);
  },
};

/**
 * 创建请求实例
 * @param config
 * @param transform
 */
function createRequest(config?: Partial<HttpRequestConfig>, transform?: RequestTransform): Request {
  const httpRequest = new Request();

  // 初始化请求配置
  httpRequest.setConfig((options: HttpRequestConfig) => {
    options = deepMerge(options, config);
    return options;
  });

  const {
    requestInterceptors = undefined,
    requestInterceptorsCatch = undefined,
    responseInterceptors = undefined,
    responseInterceptorsCatch = undefined,
  } = transform ?? {};

  // 请求拦截器
  httpRequest.interceptors.request.use(
    (config: HttpRequestConfig): HttpRequestConfig | Promise<HttpRequestConfig> => {
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config);
      }

      return config;
    },
    (error: HttpRequestConfig) => {
      if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
        return requestInterceptorsCatch(error);
      }
    }
  );

  // 响应拦截器
  httpRequest.interceptors.response.use(
    (response: HttpResponse): any => {
      if (responseInterceptors && isFunction(responseInterceptors)) {
        response = responseInterceptors(response);
      }

      return response.data;
    },
    (error: HttpError): void => {
      if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
        return responseInterceptorsCatch(error);
      }

      throw new Error(error?.errMsg);
    }
  );

  return httpRequest;
}

export const http: Request = createRequest(
  {
    baseURL: globEnv.baseUrl,
    timeout: 10 * 1000, // 请求超时时间，先不管能不能用，直接写上
    header: {
      'Content-Type': ContentTypeEnum.JSON,
    },
    withCredentials: true,
    custom: {
      auth: true, // 是否携带token
      isJoinPrefix: true, // 是否默认加入前缀
      isReturnNativeResponse: false, // 是否返回原生响应头
      isTransformResponse: true, // 需要对返回数据进行处理
    },
  },
  transform
);

// 多个不同 api 地址，直接在这里导出多个
// src/api ts 里面接口，就可以单独使用这个请求，
// import { httpTwo } from '@/utils/http'
// export const httpTwo = createRequest({
//     baseURL: 'http://localhost:9001',
// }, transform);
