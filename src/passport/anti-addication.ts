import {apiRequest, isApiError, makeErrResult, RequestMethod} from '../request';
import {Result} from '../result';
import {UosPassportEndpoint} from './types';

// 上报充值金额
export async function updatePayments(
  userId: string,
  amount: number
): Promise<Result> {
  const resp = await apiRequest(
    UosPassportEndpoint + '/v1/anti-addiction/payments',
    RequestMethod.Post,
    {
      userID: userId,
      amount,
    }
  );

  if (isApiError(resp)) {
    return makeErrResult(resp);
  }

  return {
    ok: true,
  };
}
