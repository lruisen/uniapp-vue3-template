/**
 * @description: 请求结果集
 */
export enum ResultCodeEnum {
    ERROR = 400,
    SUCCESS = 200,
    NO_LOGIN = 401,
    NO_PERMISSION = 403,
    SERVICE_ERROR = 500,
}

/**
 * 请求方法枚举
 */
export enum RequestMethodEnum {
    GET = 'GET',
    PUT = 'PUT',
    HEAD = 'HEAD',
    POST = 'POST',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS',
    CONNECT = 'CONNECT',
    TRACE = 'TRACE',
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
    // json
    JSON = 'application/json;charset=UTF-8',
    // json
    TEXT = 'text/plain;charset=UTF-8',
    // form-data 一般配合qs
    FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
    // form-data  上传
    FORM_DATA = 'multipart/form-data;charset=UTF-8',
}