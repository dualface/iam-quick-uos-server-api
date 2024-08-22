// 如果环境变量 UOS_DEBUG 设置为 true/yes/1, 则该函数返回 true
export const isDebugEnv = (): boolean => {
  const {UOS_DEBUG} = process.env;
  return UOS_DEBUG === 'true' || UOS_DEBUG === 'yes' || UOS_DEBUG === '1';
};
