// @ts-ignore
/* eslint-disable */

declare namespace API {

  type ReturnT = {
    code?: number;
    msg?: string;
  }

  // ========== App 相关实体类 ==========
  type AppPageParams = {
    appname?: number;
    title?: number;
    start?: number;
    length?: number;
  };

  type AppInfo = {
    id?: number;
    appname?: string;
    title?: string;
    owner?: string;
    addressType?: number;
    addressList?: string;
    updateTime?: string;
    registryList?: string;
  };

  type AppList = {
    data?: AppInfo[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }

  // ========== User 相关实体类 ==========
  type UserPageParams = {
    username?: string;
    role?: number;
    start?: number;
    length?: number;
  };

  type User = {
    id?: number;
    username?: string;
    password?: string;
    role?: number;
    permission?: number;
  }

  type UserList = {
    data?: User[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }

  // ========== Log 相关实体类 ==========
  type LogPageParams = {
    jobGroup?: number;
    jobId?: number;
    logStatus?: number;
    filterTime?: string;
    start?: number;
    length?: number;
  };
  type LogList = {
    data?: Log[];

    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }

  type Log = {
    id?: number;
    // job info
    jobGroup? :number;
    jobAppId? :number;
    jobId? :number;
    glueType? :string;

    // execute info
    executorAddress? :string;
    executorHandler? :string;
    executorParam? :string;
    executorShardingParam? :string;
    executorFailRetryCount? :number;

    // trigger info
    triggerTime?: string;
    triggerCode?: number;
    triggerMsg?: string;

    // handle info
    handleTime?: string;
    handleCode?: number;
    handleMsg?: string;

    // alarm info
    alarmStatus?: number;
  }

  type LogBaseInfo = {
    content?: {
      JobGroupList?: AppInfo[],
      logStatus: number,
      jobInfo: {},
    };

    /** 列表的内容总数 */
    code?: number;
    msg?: string;
  }

  type Job = {
    id?: number;
    executorHandler? :string;
    jobDesc? :string;
  }


  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

    // App 相关实体类
  type JobPageParams = {
      appname?: number;
      title?: number;
      start?: number;
      length?: number;
    };
  
    type JobInfo = {
      id: number;
      jobGroup: number;
      jobDesc: string;
      addTime: Date;
      updateTime: Date;
      author: string;
      alarmEmail?: any;
      alarm: number;
      scheduleType: string;
      scheduleConf: string;
      misfireStrategy: string;
      executorRouteStrategy: string;
      executorHandler: string;
      executorParam: string;
      executorBlockStrategy: string;
      executorTimeout: number;
      executorFailRetryCount: number;
      glueType: string;
      glueSource: string;
      glueRemark: string;
      glueUpdatetime: Date;
      childJobId: string;
      triggerStatus: number;
      triggerLastTime: number;
      triggerNextTime: number;
    };
  
    type JobList = {
      data?: JobInfo[];
      /** 列表的内容总数 */
      recordsTotal?: number;
      recordsTotal?: number;
    }
  
}
