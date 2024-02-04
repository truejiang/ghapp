// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { isEmpty } from 'lodash'
/** 获取商品销售列表 GET /api/v1/goods/sales/records */
export async function getGoodsSales(
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
    const res = request<API.GoodsSalesList>('/api/v1/goods/sales/records', {
      method: 'GET',
      params: {
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
  } else {
    const { payment_timestamp = [], order_number, order_status: order_status_check, shop: shop_name, ..._ } = query
    const [start_date, end_date] = payment_timestamp
    const order_number_check = !!order_number ? [order_number] : undefined
    const res = request<API.GoodsSalesList>('/api/v1/goods/sales/filter', {
      method: 'POST',
      data: {
        start_date,
        end_date,
        order_number_check,
        order_status_check,
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


/** 获取状态字典 */
export async function getGoodsOrderStatus(params?: { data_source?: string}) {
  const res = request('/api/v1/tools/options/order_status_check', {
    method: 'GET',
    params
  });

  const { options } = (await res)

  return {
    data: options.map(_ => ({
      label: _,
      value: _
    }))
  }
}
