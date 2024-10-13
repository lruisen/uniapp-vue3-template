import type { HttpError, HttpRequestConfig, HttpResponse } from 'luch-request';
import type { ResponseData } from '@/utils/http/types';

export interface RequestTransform {
  /**
   * 请求拦截器
   * @param config
   */
  requestInterceptors?: (config: HttpRequestConfig) => HttpRequestConfig;

  /**
   * 请求拦截器错误处理
   * @param error
   */
  requestInterceptorsCatch?: (error: HttpRequestConfig) => any;

  /**
   * 响应拦截器
   * @param response
   */
  responseInterceptors?: (response: HttpResponse<ResponseData>) => any;

  /**
   * 响应拦截器错误处理
   * @param error
   */
  responseInterceptorsCatch?: (error: HttpError) => any;
}
