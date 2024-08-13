import {
  UosRemoteConfigEndpoint,
  uosApiRequest,
  UosApiRequestMethod,
  uosIsApiError,
} from './request';
import {UosResult} from './result';

// define the remote config
export interface UosRemoteConfig {
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

// check if the value is a remote config
export function uosIsRemoteConfig(c: unknown): c is UosRemoteConfig {
  return typeof c === 'object' && (c as UosRemoteConfig).configId !== undefined;
}

// result of uosFetchRemoteConfigs
export interface uosFetchRemoteConfigsResult extends UosResult {
  configs?: {[index: string]: UosRemoteConfig};
}

// result of uosFetchRemoteConfig
export interface uosFetchRemoteConfigResult extends UosResult {
  config?: UosRemoteConfig;
}

// fetch all remote configs, return a map of key to config
export const uosFetchRemoteConfigs =
  async (): Promise<uosFetchRemoteConfigsResult> => {
    const data = await uosApiRequest(
      UosRemoteConfigEndpoint + '/v1/configs',
      UosApiRequestMethod.Get
    );

    if (uosIsApiError(data)) {
      return {
        ok: false,
        error: `${data.code}: ${data.message}`,
      };
    }

    const configs = data['configs'] as Array<UosRemoteConfig>;
    if (!Array.isArray(configs)) {
      return {
        ok: false,
        error: 'result is not remote configs',
      };
    }

    const result = {
      ok: true,
      configs: {},
    } as uosFetchRemoteConfigsResult;
    for (const c of configs) {
      if (uosIsRemoteConfig(c)) {
        result.configs![c.key] = c;
      }
    }

    return result;
  };

// fetch a single remote config, return the config or an error
export const uosFetchRemoteConfig = async (
  configId: string
): Promise<uosFetchRemoteConfigResult> => {
  const data = await uosApiRequest(
    UosRemoteConfigEndpoint + '/v1/configs/' + configId,
    UosApiRequestMethod.Get
  );

  if (uosIsApiError(data)) {
    return {
      ok: false,
      error: `${data.code}: ${data.message}`,
    };
  }

  const config = data['config'] as UosRemoteConfig;
  if (!uosIsRemoteConfig(config)) {
    return {
      ok: true,
      error: `result is not remote config for key ${configId}`,
    };
  }

  return {
    ok: true,
    config: config,
  };
};

// update a single remote config, return an error or success
export const uosUpdateRemoteConfig = async (
  configId: string,
  key: string,
  value: string
): Promise<UosResult> => {
  const data = await uosApiRequest(
    UosRemoteConfigEndpoint + '/v1/configs/' + configId,
    UosApiRequestMethod.Put,
    {
      key,
      value,
      type: 'STRING',
    }
  );

  if (uosIsApiError(data)) {
    return {
      ok: false,
      error: `${data.code}: ${data.message}`,
    };
  }

  return {
    ok: true,
  };
};

// delete a single remote config, return an error or success
export const uosDeleteRemoteConfig = async (
  configId: string
): Promise<UosResult> => {
  const data = await uosApiRequest(
    UosRemoteConfigEndpoint + '/v1/configs/' + configId,
    UosApiRequestMethod.Delete
  );

  if (uosIsApiError(data)) {
    return {
      ok: false,
      error: `${data.code}: ${data.message}`,
    };
  }

  return {
    ok: true,
  };
};
