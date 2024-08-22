import {apiRequest, isApiError, makeErrResult, RequestMethod} from '../request';
import {Result} from '../result';
import {isUosUser, UosPassportEndpoint, UosUser, UosUserStatus} from './types';

// 取得用户信息的结果
export interface GetUserResult extends Result {
  user?: UosUser;
}

// 取得指定用户的信息
export async function getUser(userId: string): Promise<GetUserResult> {
  const resp = await apiRequest(
    UosPassportEndpoint + `/v1/users/${userId}`,
    RequestMethod.Get
  );

  if (isApiError(resp)) {
    return makeErrResult(resp);
  }

  const user = resp['user'] as UosUser;
  if (!isUosUser(user)) {
    return {
      ok: false,
      error: `invalid response of user for userId:'${userId}'`,
    };
  }

  return {
    ok: true,
    user,
  };
}

// 更新用户信息的请求参数
export interface UpdateUosUserRequest {
  name: string;
  avatarUrl?: string;
  status?: UosUserStatus;
}

// 更新指定的用户
export async function updateUser(
  userId: string,
  updateRequest: UpdateUosUserRequest
): Promise<Result> {
  const resp = await apiRequest(
    UosPassportEndpoint + `/v1/users/${userId}`,
    RequestMethod.Put,
    updateRequest
  );
  if (isApiError(resp)) {
    return makeErrResult(resp);
  }
  return {
    ok: true,
  };
}

// 将用户标记为删除
export async function deleteUser(userId: string): Promise<Result> {
  const resp = await apiRequest(
    UosPassportEndpoint + `/v1/users/${userId}`,
    RequestMethod.Delete
  );
  if (isApiError(resp)) {
    return makeErrResult(resp);
  }
  return {
    ok: true,
  };
}
