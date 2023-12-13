// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { isEmpty } from 'lodash'

/** 获取商品列表 GET /api/v1/goods/ */
export async function getGoods(
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
    const res = request<API.GoodsList>('/api/v1/goods/', {
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
    const {shop: shop_name,..._} = query
    const res = request<API.GoodsSalesList>('/api/v1/goods/commission/filter', {
      method: 'POST',
      data: {
        shop_name,
        ..._,
        page_num,
        page_size
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

/** 根据id获取商品详情 GET /api/v1/goods/ */
export async function getCooperator(
  id: string,
  options?: { [key: string]: any },
) {

  const res = request<API.GoodsList>('/api/v1/goods/' + id, {
    method: 'GET',
    ...(options || {}),
  });

  const { items, total_items } = (await res).page_data.items

  return {
    data: items,
    total: total_items
  }
}

/** 编辑商品 PUT /api/v1/goods/ */
export async function updateGoods(params: API.GoodsListItem, options?: { [key: string]: any }) {
  const { id, ...data } = params
  return request<API.GoodsListItem>('/api/v1/goods/' + id, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** 新建商品 POST /api/v1/goods/ */
export async function addGoods(data: API.GoodsListItem, options?: { [key: string]: any }) {
  return request<API.GoodsListItem>('/api/v1/goods/', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 删除商品 DELETE /api/v1/goods/ */
export async function removeGoods(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/goods/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}


/** 获取模板 */
export async function getTemplateOptions() {

  const res = request<API.GoodsList>('/api/v1/tools/list/templates', {
    method: 'GET',
  });

  const { templates } = (await res)

  console.log(templates)
  return {
    data: templates.map(_ => ({
      label: _.data_source,
      value: _.data_source,
      template_filename: _.template_filename
    }))
  }
}

