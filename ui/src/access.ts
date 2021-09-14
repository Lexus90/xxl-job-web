/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState:
  { currentUser?: API.CurrentUser | undefined,
  accessApps?: API.AppInfo[]
  }) {
  const { currentUser, accessApps } = initialState || {};
  return {
    canAdmin: () => (currentUser && currentUser.role === 1),
    isAdmin: (currentUser && currentUser.role === 1),
    accessAble: (currentUser && currentUser.role === 1),
    accessApps: (accessApps),
    readable: () => !currentUser,
  };
}
