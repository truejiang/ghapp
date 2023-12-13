// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 登录接口 POST /api/v1/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.EmailLoginResult>('/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'multipart/form-data'
    },
    // req: 'form',
    data: body,
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(session_id?: string, options?: { [key: string]: any }) {
  return request('/api/v1/logoff/' + session_id, {
    method: 'PUT',
    ...(options || {}),
  });
}


/** 更新公告  GET /api/login/captcha */
export async function getSystemMessage() {
  return request('/api/v1/tools/system/message', {
    method: 'GET',
  });
}