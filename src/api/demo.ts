import { http } from '@/utils/http';
import { RequestMethodEnum } from '@/utils/http/HttpEnum';

interface ResultTest {
  code: number;
  data: any;
}

/**
 * 测试API
 * @param params
 */
export const testApi = (params: any = {}) => {
  return http.request<ResultTest>({
    url: '/test',
    method: RequestMethodEnum.GET,
    params,
  });
};
