import axios from 'axios';

export const UosRemoteConfigEndpoint = 'https://c.unity.cn';

let _uosCredentials = '';

// create base64 encoded credentials for UOS Server API
const uosApiCredentials = () => {
  if (_uosCredentials === '') {
    const {UOS_APP_ID, UOS_APP_SERVICE_SECRET} = process.env;

    if (
      typeof UOS_APP_ID === 'string' &&
      typeof UOS_APP_SERVICE_SECRET === 'string'
    ) {
      _uosCredentials = Buffer.from(
        `${UOS_APP_ID}:${UOS_APP_SERVICE_SECRET}`
      ).toString('base64');
    } else {
      throw new Error(
        'env.UOS_APP_ID or env.UOS_APP_SERVICE_SECRET is not defined'
      );
    }
  }

  return _uosCredentials;
};

// define the UOS Server API error
export interface UosApiError {
  code?: string;
  message?: string;
}

// define the UOS Server API response
export interface UosApiResponse extends UosApiError {
  [keyof: string]: unknown;
}

// check if the response is an UOS Server API error
export function uosIsApiError(resp: unknown): resp is UosApiError {
  return typeof resp === 'object' && (resp as UosApiError).code !== undefined;
}

// define the UOS Server API request method
export enum UosApiRequestMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
}

// perform a UOS Server API request
export const uosApiRequest = async (
  url: string,
  method: UosApiRequestMethod,
  data?: object,
  timeout?: number
): Promise<UosApiResponse> => {
  try {
    const resp = await axios({
      method,
      url,
      headers: {
        Authorization: `Basic ${uosApiCredentials()}`,
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
};
