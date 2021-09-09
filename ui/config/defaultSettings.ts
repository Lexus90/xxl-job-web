import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {

  "layout": "top",
  "contentWidth": "Fluid",
  "splitMenus": false,
  "navTheme": "dark",
  "primaryColor": "#1890ff",
  "footerRender": false,
  "menuRender": false,

  // layout: 'mix',
  // contentWidth: 'Fluid',
  // navTheme: 'realDark',
  // 拂晓蓝
  // primaryColor: '#1890ff',

  // fixedHeader: false,
  // fixSiderbar: true,
  colorWeak: false,
  title: 'XXL-JOB',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
};

export default Settings;


