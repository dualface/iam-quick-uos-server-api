// 简化后的 UOS API 返回结果, 用于 quick-uos-server-api 返回给调用代码
export interface Result {
  ok: boolean;
  error?: string;
}
