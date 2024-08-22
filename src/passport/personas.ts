import {apiRequest, isApiError, makeErrResult, RequestMethod} from '../request';
import {Result} from '../result';
import {
  isUosPersona,
  UosCustomProperties,
  UosFriendRelation,
  UosPassportEndpoint,
  UosPersona,
  UosPersonaStatus,
} from './types';

// 取得角色信息的结果
export interface GetPersonaResult extends Result {
  persona?: UosPersona;
}
// 取得指定角色的信息
export async function getPersona(personaId: string): Promise<GetPersonaResult> {
  const resp = await apiRequest(
    UosPassportEndpoint + `/v1/personas/${personaId}`,
    RequestMethod.Get
  );

  if (isApiError(resp)) {
    return makeErrResult(resp);
  }

  const persona = resp['persona'] as UosPersona;
  if (!isUosPersona(persona)) {
    return {
      ok: false,
      error: `invalid response of persona for personaId:'${personaId}'`,
    };
  }

  return {
    ok: true,
    persona,
  };
}

// 更新角色信息的请求参数
export interface UpdateUosPersonaRequest {
  displayName: string;
  iconUrl?: string;
  status?: UosPersonaStatus;
  properties?: UosCustomProperties;
}

// 更新指定的角色
export async function updatePersona(
  personaId: string,
  updateRequest: UpdateUosPersonaRequest
): Promise<Result> {
  const resp = await apiRequest(
    UosPassportEndpoint + `/v1/personas/${personaId}`,
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

// 将角色标记为删除
export async function deletePersona(personaId: string): Promise<Result> {
  const resp = await apiRequest(
    UosPassportEndpoint + `/v1/personas/${personaId}`,
    RequestMethod.Delete
  );
  if (isApiError(resp)) {
    return makeErrResult(resp);
  }
  return {
    ok: true,
  };
}

// 取得好友列表的结果
export interface GetFriendsResult extends Result {
  // 好友关系列表
  friends?: UosFriendRelation[];

  // 查询起始点
  start?: number;

  // 查询数量
  count?: number;

  // 总数量
  total?: number;
}

// 取得好友列表
export async function getFriends(
  personaId: string,
  start: number,
  count: number
): Promise<GetFriendsResult> {
  const resp = await apiRequest(
    UosPassportEndpoint + `/v1/personas/${personaId}/friends`,
    RequestMethod.Get,
    {
      start,
      count,
    }
  );

  if (isApiError(resp)) {
    return makeErrResult(resp);
  }

  const friends = resp['friends'] as UosFriendRelation[];
  if (!Array.isArray(friends)) {
    return {
      ok: false,
      error: `invalid response of friends for personaId:'${personaId}'`,
    };
  }

  return {
    ok: true,
    friends,
    start: resp['start'],
    count: resp['count'],
    total: resp['total'],
  };
}
