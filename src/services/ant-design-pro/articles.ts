// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取文章列表 GET /api/v1/articles/ */
export async function getArticles(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {

  const res = request<API.ArticlesList>('/api/v1/articles/', {
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

/** 根据id获取文章详情 GET /api/v1/articles/ */
export async function getArticle(
  article_id: string,
  options?: { [key: string]: any },
) {

  const res = request<API.ArticlesList>('/api/v1/articles/' + article_id, {
    method: 'GET',
    ...(options || {}),
  });

  const { items, total_items} = (await res).page_data.items

  return { 
    data: items,
    total: total_items
  }
}

/** 编辑文章 PUT /api/v1/articles/ */
export async function updateArticle(params: API.ArticleListItem, options?: { [key: string]: any }) {
  const {article_id, ...data} = params
  return request<API.ArticleListItem>('/api/v1/articles/' + article_id, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/** 新建文章 POST /api/v1/articles/ */
export async function addArticle(data: API.ArticleListItem, options?: { [key: string]: any }) {
  return request<API.ArticleListItem>('/api/v1/articles/', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 删除文章 DELETE /api/v1/articles/ */
export async function removeArticle(article_id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/articles/${article_id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
