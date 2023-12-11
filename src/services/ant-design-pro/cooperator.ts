// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { isEmpty } from 'lodash'

/** 获取联创列表 GET /api/v1/cooperators/ */
export async function getCooperators(
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
    const res = request<API.CooperatorsList>('/api/v1/cooperators/', {
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
    const { name: cooperator_name,..._ } = query

    const res = request<API.CooperatorsList>('/api/v1/cooperators/cooperator/filter', {
      method: 'POST',
      data: {
        cooperator_name,
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

/** 根据id获取联创详情 GET /api/v1/cooperators/ */
export async function getCooperator(
  article_id: string,
  options?: { [key: string]: any },
) {

  const res = request<API.CooperatorsList>('/api/v1/cooperators/' + article_id, {
    method: 'GET',
    ...(options || {}),
  });

  const { items, total_items} = (await res).page_data.items

  return { 
    data: items,
    total: total_items
  }
}

/** 编辑联创 PUT /api/v1/cooperators/ */
export async function updateCooperator(params: API.CooperatorListItem, options?: { [key: string]: any }) {
  const {id, ...data} = params
  return request<API.CooperatorListItem>('/api/v1/cooperators/' + id, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** 新建联创 POST /api/v1/cooperators/ */
export async function addCooperator(data: API.CooperatorListItem, options?: { [key: string]: any }) {
  return request<API.CooperatorListItem>('/api/v1/cooperators/', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 删除联创 DELETE /api/v1/cooperators/ */
export async function removeCooperator(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/cooperators/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
