import { request } from '@umijs/max';

/** 获取状态字典 */
export async function getOptionsOrderStatusCheck() {
  const res = request('/api/v1/tools/options/report_name_check', {
    method: 'GET'
  });

  const { options, info } = (await res)
  console.log("🚀 ~ file: reportManagment.ts:10 ~ getOptionsOrderStatusCheck ~ options:", options)
  return {
    data: options.map(_ => ({
      label: _,
      value: _,
      description: info[_]?.description
    }))
  }
}

/** 获取报告下载历史记录列表 GET /api/v1/history/report_history/ */
export async function getReportHistoryList(params: {
  // query
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  const { current: page_num, pageSize: page_size, ...query } = params


  const res = request('/api/v1/history/report_history/', {
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

/** 根据id获取数据批导历史记录 GET /api/v1/history/report_history/ */
export async function getReportHistoryById(execute_id: string) {
  return request('/api/v1/history/report_history/' + execute_id, {
    method: 'GET'
  });
}

/** 更新数据批导历史记录 PUT /api/v1/history/report_history/ */
export async function updateReportHistory(execute_id: string) {
   return request('/api/v1/history/report_history/' + execute_id, {
    method: 'GET',
    // params: {
    //   is_repeal: true
    // }
  });
}