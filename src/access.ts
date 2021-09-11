/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState:
  { currentUser?: API.CurrentUser | undefined,
  accessApps?: API.AppInfo[]
  }) {
  const { currentUser, accessApps } = initialState || {};
  return {
    canAdmin: () => (currentUser && currentUser.access === 'admin'),
    isAdmin: (currentUser && currentUser.access === 'admin'),
    accessAble: (currentUser && currentUser.access === 'admin'),
    accessApps: (accessApps),
    readable: () => !currentUser,
  };
}
