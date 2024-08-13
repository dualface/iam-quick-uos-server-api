export const DebugEnv = (): boolean => {
  const {UOS_DEBUG} = process.env;
  return UOS_DEBUG === 'true' || UOS_DEBUG === 'yes' || UOS_DEBUG === '1';
};
