// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户列表 GET /api/v1/users/ */
export async function getUsers(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {

  const res = request<API.UsersList>('/api/v1/users/', {
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
}


/** 编辑用户 PUT /api/v1/users/ */
export async function updateUser(params: API.UserListItem, options?: { [key: string]: any }) {
  // id需要修改
  const { id, ...data } = params
  return request<API.UserListItem>(`/api/v1/users/${id}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** 新建用户 POST /api/v1/users/ */
export async function addUser(data: API.UserListItem, options?: { [key: string]: any }) {
  return request<API.UserListItem>('/api/v1/users/', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/v1/users/ */
export async function removeUser(user_id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/users/${user_id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
