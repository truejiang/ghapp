import { request } from '@umijs/max';

/** 获取状态字典 */
export async function getOptionsOrderStatusCheck() {
  const res = request('/api/v1/tools/options/report_name_check', {
    method: 'GET'
  });

  const { options } = (await res)

  return {
    data: options.map(_ => ({
      label: _,
      value: _
    }))
  }
}