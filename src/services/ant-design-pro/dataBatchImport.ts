// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
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
    const { ..._} = query

    const res = request<API.FinancesList>('/api/v1/finances/fin_split/filter', {
      method: 'POST',
      data: {
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

export async function downloadReport(params: API.FinancesReportQuery, options?: { [key: string]: any }) {
  return request<API.FinancesReportQuery>('/api/v1/tools/download/reports/', {
    method: 'POST',
    params,
    ...(options || {}),
  });
}

export async function dataBatchImport(data: {data_source: string, file_list: UploadFile[]}, options?: { [key: string]: any }) {
  const { data_source, file_list = [] } = data
  const formData = new FormData();
    file_list.forEach((file) => {
      formData.append('file_list', file as RcFile);
    });

  return request('/api/v1/tools/upload/excel_list', {
    method: 'POST',
    data: formData,
    params: {
      data_source
    },
    ...(options || {}),
  });
}

/** 获取数据批导历史记录列表 GET /api/v1/history/upload_history/ */
export async function getDataImportHistoryList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  const { current: page_num, pageSize: page_size, ...query } = params


  const res = request('/api/v1/history/upload_history/', {
    method: 'GET',
    params: {
      page_num: params.current,
      page_size: params.pageSize,
      ...query
    },
  });

  const { items, total_items } = (await res).page_data.items;

  return {
    data: items,
    total: total_items,
  };
}

/** 根据id获取数据批导历史记录 GET /api/v1/history/upload_history/ */
export async function getDataImportHistory(execute_id: string) {
  return request('/api/v1/history/upload_history/' + execute_id, {
    method: 'GET'
  });
}

/** 更新数据批导历史记录 PUT /api/v1/history/upload_history/ */
export async function updateDataImportHistory(execute_id: string) {
   return request('/api/v1/history/upload_history/' + execute_id, {
    method: 'GET',
    params: {
      is_repeal: true
    }
  });
}