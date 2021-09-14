/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState:
  { currentUser?: API.CurrentUser | undefined,
  accessApps?: API.AppInfo[]
  }) {
  const { currentUser, accessApps } = initialState || {};
  const isDev = process.env.NODE_ENV === 'development';
  return {
    canAdmin: () => (currentUser && currentUser.role === 1 || isDev),
    isAdmin: (currentUser && currentUser.role === 1 || isDev),
    accessAble: (currentUser && currentUser.role === 1 || isDev),
    accessApps: (accessApps),
    readable: () => !currentUser,
  };
}
