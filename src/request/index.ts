import axios from 'axios';
import {Result} from '../result';

let credentials = '';

// create base64 encoded credentials for UOS Server API
function apiCredentials() {
  if (credentials === '') {
    const {UOS_APP_ID, UOS_APP_SERVICE_SECRET} = process.env;

    if (
      typeof UOS_APP_ID === 'string' &&
      typeof UOS_APP_SERVICE_SECRET === 'string'
    ) {
      credentials = Buffer.from(
        `${UOS_APP_ID}:${UOS_APP_SERVICE_SECRET}`
      ).toString('base64');
    } else {
      throw new Error(
        'env.UOS_APP_ID or env.UOS_APP_SERVICE_SECRET is not defined'
      );
    }
  }

  return credentials;
}

// UOS API 返回的错误
export interface ApiError {
  code?: string;
  message?: string;
}

// UOS API 返回的响应结构
export interface ApiResponse extends ApiError {
  [keyof: string]: unknown;
}

// check if the response is an UOS Server API error
export function isApiError(resp: unknown): resp is ApiError {
  return typeof resp === 'object' && (resp as ApiError).code !== undefined;
}

// 从 ApiError 创建 Result
export function makeErrResult(err: ApiError): Result {
  return {
    ok: false,
    error: `${err.code}: ${err.message}`,
  };
}

export enum RequestMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
}

// 执行 UOS API 请求
export async function apiRequest(
  url: string,
  method: RequestMethod,
  data?: object,
  timeout?: number
): Promise<ApiResponse> {
  try {
    const resp = await axios({
      method,
      url,
      headers: {
        Authorization: `Basic ${apiCredentials()}`,
        'Content-Type': 'application/json',
      },
      timeout: timeout ?? 1000,
      data: data ?? {},
    });

    if (resp.data.code !== undefined) {
      return {
        code: resp.data.code.toString(),
        message: resp.data.message ?? 'unknown error',
      };
    }

    return resp.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.response) {
      return {
        code: `http[${e.response.status}]`,
        message: `http status code is ${e.response.status}, ${e.response.statusText}, ${JSON.stringify(e.response.data)}`,
      };
    } else if (e.request) {
      return {
        code: `http[${e.request.status}]`,
        message: `${e.request.statusText}`,
      };
    } else {
      return {
        code: 'unknown',
        message: `exception thrown from axios, ${e.message}`,
      };
    }
  }
}
