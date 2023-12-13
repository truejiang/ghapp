// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 根据id获取商品详情 GET /api/v1/goods/ */
export async function getUserInfo(
  options?: { [key: string]: any },
) {

  return request<API.CurrentUser>('/api/v1/users/current_user', {
    method: 'GET',
    ...(options || {}),
  });
}


/** 修改密码 */
export async function resetPassword(body: API.ResetPassword, options?: { [key: string]: any }) {
  return request('/api/v1/reset_password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {}),
  });
}
