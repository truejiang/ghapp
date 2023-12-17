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