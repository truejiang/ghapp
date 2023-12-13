// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { isEmpty } from 'lodash'

/** 获取财务列表 GET /api/v1/finances/ */
export async function getFinances(
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

  if(isEmpty(query)) {
    const res = request<API.FinancesList>('/api/v1/finances/', {
      method: 'GET',
      params: {
        page_num: params.current,
        page_size: params.pageSize
      },
      ...(options || {}),
    });
  
    const { items, total_items} = (await res).page_data.items
  
    return { 
      data: items,
      total: total_items
    }
  } else {
    const { cooperator_id: cooperator_name, account_id: account_name,..._} = query

    const res = request<API.FinancesList>('/api/v1/finances/fin_split/filter', {
      method: 'POST',
      data: {
        cooperator_name,
        account_name,
        ..._,
        page_num: params.current,
        page_size: params.pageSize
      },
      ...(options || {}),
    });
  
    const { items, total_items} = (await res).page_data.items
  
    return { 
      data: items,
      total: total_items
    }
  }
  
}

/** 根据id获取财务详情 GET /api/v1/finances/ */
export async function getFinance(
  finance_id: string,
  options?: { [key: string]: any },
) {

  const res = request<API.FinancesList>('/api/v1/finances/' + finance_id, {
    method: 'GET',
    ...(options || {}),
  });

  const { items, total_items} = (await res).page_data.items

  return { 
    data: items,
    total: total_items
  }
}

/** 编辑财务 PUT /api/v1/finances/ */
export async function updateFinance(params: API.FinancesListItem, options?: { [key: string]: any }) {
  const {id, ...data} = params
  return request<API.FinancesListItem>('/api/v1/finances/' + id, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** 新建财务 POST /api/v1/finances/ */
export async function addFinance(data: API.FinancesListItem, options?: { [key: string]: any }) {
  return request<API.FinancesListItem>('/api/v1/finances/', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 删除财务 DELETE /api/v1/finances/ */
export async function removeFinance(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/finances/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 下载
export async function downloadReport(params: API.FinancesReportQuery, options?: { [key: string]: any }) {
  return request<API.FinancesReportQuery>('/api/v1/finances/report/download/', {
    method: 'POST',
    params,
    ...(options || {}),
  });
}

export async function getSalesFilterOrderStatus() {
  const res = request<API.FinancesReportQuery>('/api/v1/goods/sales/filter/options/order_status_check', {
    method: 'GET'
  });

  const { options = []} = (await res)
  return {
    data: options.map(_ => ({
      label: _,
      value: _
    }))
  }
}