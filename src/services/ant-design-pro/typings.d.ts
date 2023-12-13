// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    session_id?: string,
    id: number,
    username: string,
    email: string,
    is_active: string,
    is_superuser: string,
    is_admin: string,
    created_by_userid: string,
    created_timestamp: string,
    modified_by_userid: string,
    modified_timestamp: string
  };

  type LoginResult = {
    // status?: string;
    // type?: string;
    // currentAuthority?: string;
    access_token?: string;
    token_type?: string;
  };

  type EmailLoginResult = {
    access_token: string,
    token_type: string,
    session_id: string,
    user: {
      id: number,
      username: string,
      email: string,
      is_active: string,
      is_superuser: string,
      is_admin: string,
      created_by_userid: string,
      created_timestamp: string,
      modified_by_userid: string,
      modified_timestamp: string
    }
  }

  type PageParams = {
    current?: number;
    pageSize?: number;
    page_num?: number;
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
    email?: string;
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
    ip_address: string;
    browser: string;
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

  // 用户管理
  type UserListItem = {
    id?: number;
    username?: string;
    _username?: string;
    email?: string;
    password?: string;
    _password?: string;
    is_admin?: any;
    is_active?: any;
    is_superuser?: boolean;

    user_id?: number;
    modified_by_userid?: number;

  }

  // 用户管理列表
  type UsersList = {
    page_data: {
      items: {
        items?: UserListItem[],
        total_items: number
      }
    }
  }

  // 修改密码
  type ResetPassword = {
    token: string,
    password: string,
  }

  // 文章管理
  type ArticleListItem = {
    article_id?: number;
    user_id?: number;
    article_title: string;
    article_text: string;
    tags: string[];
  }

  // 文章管理列表
  type ArticlesList = {
    page_data: {
      items: {
        items?: ArticleListItem[],
        total_items: number
      }
    }
  }

  // 联创管理
  type CooperatorListItem = {
    id?: number;
    created_by_userid?: number;
    cooperator_id?: number;
    name: string;
    founder?: string;
    tags?: string;
    cooperator_name?: string;
    created_by_userid?: string;
    created_timestamp?: string;
    modified_by_userid?: string;
    modified_timestamp?: string;
  }

  // 联创管理列表
  type CooperatorsList = {
    page_data: {
      items: {
        items?: CooperatorsListItem[],
        total_items: number
      }
    }
  }

  // 账号管理
  type AccountsListItem = {
    id?: number;
    account_id: number;
    account_name: string;
    platform?: string;
    created_by_userid?: string;
    created_timestamp?: string;
    modified_by_userid?: string;
    modified_timestamp?: string;
  }

  // 账号管理列表
  type AccountsList = {
    page_data: {
      items: {
        items?: AccountsListItem[],
        total_items: number
      }
    }
  }

  // 商品提成
  type GoodsListItem = {
    id?: number;
    goods_id?: number;
    shop: string;
    goods_name: string;
    commission_rate?: string;
    commission_fixed?: string;
    price?: string;
    created_by_userid?: string;
    created_timestamp?: string;
    modified_by_userid?: string;
    modified_timestamp?: string;
  }

  // 商品提成列表
  type GoodsList = {
    page_data: {
      items: {
        items?: GoodsListItem[],
        total_items: number
      }
    }
  }

  // 商品销售提成
  type GoodsSalesListItem = {
    id?: number;
    goods_name?: string;
    goods_id: string;
    shop: string;
    payment_timestamp?: string;
    settlement_timestamp?: string;
    order_number?: string;
    order_status?: string;
    payment_amount?: string;
    order_type?: string;
    commission_rate?: string;
    estimated_revenue: number,
    estimated_technical_service_fee: number
    account_name: string
    account_id: string
    account_uid: string
    operator: string
    data_source: string
    created_by_userid: string
    created_timestamp: string
    modified_by_userid: string
    modified_timestamp: string
  }

  // 商品销售提成列表
  type GoodsSalesList = {
    page_data: {
      items: {
        items?: GoodsSalesListItem[],
        total_items: number
      }
    }
  }

  // 分账管理
  type FinancesListItem = {
    id?: number;
    finances_id?: number;
    cooperator_id: number;
    cooperator_name?: string;
    account_id: number;
    account_name?: string;
    split_rate: number;
    remarks?: string;
    fixed_charges?: string;
    created_by_userid?: string;
    created_timestamp?: string;
    modified_by_userid?: string;
    modified_timestamp?: string;
  }

  // 分账管理列表
  type FinancesList = {
    page_data: {
      items: {
        items?: FinancesListItem[],
        total_items: number
      }
    }
  }

  // 分账报告下载
  type FinancesReportQuery = {
    start_date: string;
    end_date: string;
  }
}
