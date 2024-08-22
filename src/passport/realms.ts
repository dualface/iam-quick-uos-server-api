import {apiRequest, isApiError, RequestMethod} from '../request';
import {Result} from '../result';
import {UosRealm, UosPassportEndpoint, isUosRealm} from './types';

export interface FetchAllRealmsResult extends Result {
  start?: number;
  count?: number;
  total?: number;
  realms?: {[name: string]: UosRealm};
}

let _cachedFetchAllResult: FetchAllRealmsResult | undefined;

// 取得所有域信息并缓存
export async function fetchAllRealms(
  flush?: boolean
): Promise<FetchAllRealmsResult> {
  if (flush !== true && _cachedFetchAllResult !== undefined) {
    return _cachedFetchAllResult;
  }

  const resp = await apiRequest(
    UosPassportEndpoint + '/v1/realms/search',
    RequestMethod.Post
  );

  if (isApiError(resp)) {
    return {
      ok: false,
      error: `${resp.code}: ${resp.message}`,
    };
  }

  const realms = resp['realms'] as Array<UosRealm>;
  if (!Array.isArray(realms)) {
    return {
      ok: false,
      error: 'result is not realms array',
    };
  }

  const result = {
    ok: true,
    start: resp['start'],
    count: resp['count'],
    total: resp['total'],
    realms: {},
  } as FetchAllRealmsResult;
  for (const r of realms) {
    result.realms![r.name] = r;
  }

  _cachedFetchAllResult = result;

  return result;
}

export interface GetDefaultRealmResult extends Result {
  realm?: UosRealm;
}

// 取得名为 default 的默认域
export async function getDefaultRealm(): Promise<GetDefaultRealmResult> {
  const result = await fetchAllRealms();

  if (!result.ok) {
    return result;
  }

  const realm = result.realms!['default'];
  if (!isUosRealm(realm)) {
    return {
      ok: false,
      error: 'default realm not found',
    };
  }

  return {
    ok: true,
    realm,
  };
}
