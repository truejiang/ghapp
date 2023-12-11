import { request } from "@umijs/max";
import { saveAs } from 'file-saver'
import { getToken } from "./indexs";
import { message } from "antd";


// 通用下载方法
export function download(
  url: string,
  params: { [key: string]: any },
  fileName?: string,
  method?: any,
  headers = { "Content-Type": "application/x-www-form-urlencoded", 'Authorization': getToken() },
) {
  return request(url, {
    method: method || 'POST',
    headers,
    responseType: "blob",
    params
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
  headers = { "Content-Type": "application/x-www-form-urlencoded", 'Authorization': getToken() },
) {
  return request(url, {
    method: 'POST',
    headers,
    responseType: "blob",
    data
  })
    .then(async (data) => {
      // const blob = new Blob([data]);
      saveAs(data, fileName);
      message.success('下载成功！')
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