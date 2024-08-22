import {apiRequest, RequestMethod, isApiError} from '../request';
import {Result} from '../result';

const UosRemoteConfigEndpoint = 'https://c.unity.cn';

// Remote Config 结构
export interface RemoteConfig {
  configId: string;
  key: string;
  type: string;
  value: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
  resourceAge: number;
  overrideCount: number;
}

export function isRemoteConfig(c: unknown): c is RemoteConfig {
  return (
    typeof c === 'object' &&
    c !== null &&
    typeof (c as RemoteConfig).configId === 'string'
  );
}

export interface FetchAllRemoteConfigsResult extends Result {
  configs?: {[index: string]: RemoteConfig};
}

let _cachedFetchAllResult: FetchAllRemoteConfigsResult | undefined;

// 取得所有 RemoteConfig, 并缓存
export async function fetchAllRemoteConfigs(
  flush?: boolean
): Promise<FetchAllRemoteConfigsResult> {
  if (flush !== true && _cachedFetchAllResult !== undefined) {
    return _cachedFetchAllResult;
  }

  const resp = await apiRequest(
    UosRemoteConfigEndpoint + '/v1/configs',
    RequestMethod.Get
  );

  if (isApiError(resp)) {
    _cachedFetchAllResult = {
      ok: false,
      error: `${resp.code}: ${resp.message}`,
    };
    return _cachedFetchAllResult;
  }

  const configs = resp['configs'] as Array<RemoteConfig>;
  if (!Array.isArray(configs)) {
    _cachedFetchAllResult = {
      ok: false,
      error: 'result is not remote configs',
    };
    return _cachedFetchAllResult;
  }

  _cachedFetchAllResult = {
    ok: true,
    configs: {},
  } as FetchAllRemoteConfigsResult;
  for (const c of configs) {
    if (isRemoteConfig(c)) {
      _cachedFetchAllResult.configs![c.key] = c;
    }
  }

  return _cachedFetchAllResult;
}

export interface FetchRemoteConfigResult extends Result {
  config?: RemoteConfig;
}

// 取得指定 key 的 Remote Config, 如果缓存为空会先尝试拉取所有 Remote Config
export async function getRemoteConfig(
  key: string
): Promise<FetchRemoteConfigResult> {
  const result = await fetchAllRemoteConfigs();

  if (!result.ok) {
    return result;
  }

  const config = result.configs![key];
  if (!isRemoteConfig(config)) {
    return {
      ok: false,
      error: `config ${key} not found`,
    };
  }

  return {
    ok: true,
    config,
  };
}

// 按照 configId 更新 Remote Config
export async function updateRemoteConfig(
  configId: string,
  key: string,
  value: string
): Promise<Result> {
  const data = await apiRequest(
    UosRemoteConfigEndpoint + '/v1/configs/' + configId,
    RequestMethod.Put,
    {
      key,
      value,
      type: 'STRING',
    }
  );

  if (isApiError(data)) {
    return {
      ok: false,
      error: `${data.code}: ${data.message}`,
    };
  }

  return {
    ok: true,
  };
}

// 删除指定 configId 的 Remote Config
export async function delRemoteConfig(configId: string): Promise<Result> {
  const data = await apiRequest(
    UosRemoteConfigEndpoint + '/v1/configs/' + configId,
    RequestMethod.Delete
  );

  if (isApiError(data)) {
    return {
      ok: false,
      error: `${data.code}: ${data.message}`,
    };
  }

  return {
    ok: true,
  };
}
