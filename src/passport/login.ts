import {apiRequest, isApiError, RequestMethod} from '../request';
import {Result} from '../result';
import {UosCustomProperties, UosPersona, UosPassportEndpoint} from './types';

// 登录响应
export interface Login {
  // 角色信息
  persona: UosPersona;

  // 角色访问 Token
  personaAccessToken: string;

  // 角色刷新 Token
  personaRefreshToken: string;

  // 是否是新用户
  isNew: boolean;

  // 角色访问 Token 过期时间 (UNIX TIMESTAMP SECONDS)
  expiresAt: string;
}

// 登录参数
export interface LoginParams {
  // 外部用户 ID
  externalUserID: string;

  // 昵称
  displayName: string;

  // 外部角色 ID
  externalPersonalID?: string;

  // 外部应用 AppID
  externalAppId?: string;

  // 外部用户 ID 提供方
  idProvider?: string;

  // 角色扩展属性
  properties?: UosCustomProperties;
}

// 登录结果
export interface LoginResult extends Result {
  // 登录响应
  login?: Login;
}

// 登录
export async function login(request: LoginParams): Promise<LoginResult> {
  const resp = await apiRequest(
    UosPassportEndpoint + '/v1/login/external',
    RequestMethod.Post,
    request
  );

  if (isApiError(resp)) {
    return {
      ok: false,
      error: `${resp.code}: ${resp.message}`,
    };
  }

  return {
    ok: true,
    login: resp as Login,
  };
}
