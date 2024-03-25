declare namespace API {
  type ApiResponse = {
    code?: number;
    type?: string;
    message?: string;
  };

  type Category = {
    id?: number;
    name?: string;
  };

  type deleteOrderParams = {
    /** ID of the order that needs to be deleted */
    orderId: number;
  };

  type deletePetParams = {
    api_key?: string;
    /** Pet id to delete */
    petId: number;
  };

  type deleteUserParams = {
    /** The name that needs to be deleted */
    username: string;
  };

  type findPetsByStatusParams = {
    /** Status values that need to be considered for filter */
    status: ('available' | 'pending' | 'sold')[];
  };

  type findPetsByTagsParams = {
    /** Tags to filter by */
    tags: string[];
  };

  type getOrderByIdParams = {
    /** ID of pet that needs to be fetched */
    orderId: number;
  };

  type getPetByIdParams = {
    /** ID of pet to return */
    petId: number;
  };

  type getUserByNameParams = {
    /** The name that needs to be fetched. Use user1 for testing.  */
    username: string;
  };

  type loginUserParams = {
    /** The user name for login */
    username: string;
    /** The password for login in clear text */
    password: string;
  };

  type Order = {
    id?: number;
    petId?: number;
    quantity?: number;
    shipDate?: string;
    /** Order Status */
    status?: 'placed' | 'approved' | 'delivered';
    complete?: boolean;
  };

  type Pet = {
    id?: number;
    category?: Category;
    name: string;
    photoUrls: string[];
    tags?: Tag[];
    /** pet status in the store */
    status?: 'available' | 'pending' | 'sold';
  };

  type Tag = {
    id?: number;
    name?: string;
  };

  type updatePetWithFormParams = {
    /** ID of pet that needs to be updated */
    petId: number;
  };

  type updateUserParams = {
    /** name that need to be updated */
    username: string;
  };

  type uploadFileParams = {
    /** ID of pet to update */
    petId: number;
  };

  type User = {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    /** User Status */
    userStatus?: number;
  };

  type IpPayListItem = {
    id: number;
    cooperator_id: string;
    cooperator_name: string;
    account_id: string;
    account_name: string;
    split_rate: number;
    fixed_charges: number;
    remarks: string;
    created_by_userid: number;
    created_timestamp: string;
    modified_by_userid: number;
    modified_timestamp: string;
  };

  // 供应链列表返回值
  type ShopListItem = {
    report_execute_id: any;
    report_filter: string;
    execute_info: ReactNode;
    id: number;
    shop: string;
    goods_name: string;
    commission_rate: number;
    commission_fixed: number;
    price: number;
    created_by_userid: number;
    created_timestamp: string;
    modified_by_userid: number;
    modified_timestamp: string;
    execute_id?: string;
  };

  type CreateShopItem = {
    shop_id: string,
    shop: string,
    is_supplier: true,
    annotation: string,
    data_source: string | "系统",
    execute_id: string,
    created_by_userid: number,
    modified_by_userid: number
  }

  type UpdateShopListItem = {
    shop_id: string,
    is_supplier: boolean,
    annotation?: string,
    modified_by_userid?: number
  }

  type DataBatchImportHistoryListParams = {
    is_repeal: boolean,
    report_execute_id: string,
    modified_by_userid: number,
    modified_timestamp: string
  }

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
    account_id: string;
    account_name: string;
    platform?: string;
    created_by_userid?: string;
    created_timestamp?: string;
    modified_by_userid?: string;
    modified_timestamp?: string;
    is_authorizedDY: boolean;
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

  // 商品佣金
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

  // 商品佣金列表
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

  // 分账配置
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

  // 分账配置列表
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

  // 数据批导
  type DataBatchImport = {
    data_source: string;
    file_list: UploadFile[];
  }
}
