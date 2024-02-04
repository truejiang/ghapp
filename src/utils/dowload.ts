import { request } from '@umijs/max';
import { message } from 'antd';
import { saveAs } from 'file-saver';
import { getToken } from './indexs';

function getFilename(contentDisposition) {
  const filenameRegex = /filename\*=utf-8''([^;]+)/;
  const match = filenameRegex.exec(contentDisposition);
  if (match && match[1]) {
      return decodeURIComponent(match[1]);
  }
  return null;
}

// 通用下载方法
export function download(
  url: string,
  params: { [key: string]: any },
  fileName?: string,
  method?: any,
  headers = { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: getToken() },
) {
  return request(url, {
    method: method || 'POST',
    headers,
    responseType: 'blob',
    params,
  })
    .then(async (data) => {
      // const blob = new Blob([data]);
      saveAs(data, fileName);
    })
    .catch((r) => {
      console.error(r);
      // TODO 需要补全antd的提示
      // atMessage({
      //   message: "下载文件出现错误，请联系管理员！",
      //   type: 'error'
      // })
    });
}

// 通用下载方法 TODO 临时用，后续优化
export function downloadPost(
  url: string,
  data: { [key: string]: any },
  fileName?: string,
  headers = { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: getToken() },
) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers,
      responseType: 'blob',
      body: JSON.stringify(data),
    })
      .then(response => response)
      .then(async (response) => {
        const { headers } = response
        if(!fileName) {
          const contentDisposition = headers.get('Content-Disposition');
          fileName = getFilename(contentDisposition);
        }
        const data = await response.blob()
        // const blob = new Blob([data]);
        saveAs(data, fileName);
        resolve()
        message.success('下载成功！');
      })
      .catch((r) => {
        reject()
        console.error(r);
        // TODO 需要补全antd的提示
        // atMessage({
        //   message: "下载文件出现错误，请联系管理员！",
        //   type: 'error'
        // })
      });
  });
}

/**
 * 触发从指定 URL 下载文件，文件名自动从 URL 提取和解码（如果需要）。
 * @param {string} downloadUrl - 需要下载文件的 URL。
 */
export function downloadFile(downloadUrl: string): void {
  // 从 URL 中提取文件名
  const urlParts = downloadUrl.split('/');
  let fileName = urlParts[urlParts.length - 1] || 'download';

  // 尝试解码文件名，如果它包含百分号编码
  if (fileName.includes('%')) {
    try {
      fileName = decodeURIComponent(fileName);
    } catch (e) {
      // 如果解码过程中出现错误，保持原始编码的文件名
      console.error('Error decoding the URL component:', e);
    }
  }

  // 创建一个隐藏的 a 标签
  const element = document.createElement('a');
  element.href = downloadUrl;
  element.download = fileName;

  // 将其设置为隐藏
  element.style.display = 'none';

  // 将其添加到 DOM 中
  document.body.appendChild(element);

  // 模拟点击下载
  element.click();

  // 从 DOM 中移除
  document.body.removeChild(element);
}
