// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { isEmpty } from 'lodash'

/** 获取账号列表 GET /api/v1/accounts/ */
export async function getAccounts(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const { current: page_num, pageSize: page_size, ...query } = params

  if (isEmpty(query)) {
    const res = request<API.AccountsList>('/api/v1/accounts/', {
      method: 'GET',
      params: {
        page_num: params.current,
        page_size: params.pageSize
      },
      ...(options || {}),
    });

    const { items, total_items } = (await res).page_data.items

    return {
      data: items,
      total: total_items
    }
  } else {
    const {account_id, ..._} = query
    const account_id_check = !!account_id ? [account_id] : undefined
    const res = request<API.AccountsList>('/api/v1/accounts/account/filter', {
      method: 'POST',
      data: {
        account_id_check,
        ..._,
        page_num: params.current,
        page_size: params.pageSize
      },
      ...(options || {}),
    });

    const { items, total_items } = (await res).page_data.items

    return {
      data: items,
      total: total_items
    }
  }

}

/** 根据id获取账号详情 GET /api/v1/accounts/ */
export async function getAccount(
  article_id: string,
  options?: { [key: string]: any },
) {

  const res = request<API.AccountsList>('/api/v1/accounts/' + article_id, {
    method: 'GET',
    ...(options || {}),
  });

  const { items, total_items } = (await res).page_data.items

  return {
    data: items,
    total: total_items
  }
}

/** 编辑账号 PUT /api/v1/accounts/ */
export async function updateAccount(params: API.AccountsListItem, options?: { [key: string]: any }) {
  const { account_id, ...data } = params
  console.log(params)
  return request<API.AccountsListItem>('/api/v1/accounts/' + account_id, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** 新建账号 POST /api/v1/accounts/ */
export async function addAccount(data: API.AccountsListItem, options?: { [key: string]: any }) {
  return request<API.AccountsListItem>('/api/v1/accounts/', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 删除账号 DELETE /api/v1/accounts/ */
export async function removeAccount(account_id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/accounts/${account_id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
