const TOKEN = 'TOKEN'

export function setToken(token: string) {
  localStorage.setItem(TOKEN, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN)
}

export function removeToken() {
  return localStorage.removeItem(TOKEN)
}

const SESSION_ID = 'SESSION_ID'
export function setSessionId(token: string) {
  localStorage.setItem(SESSION_ID, token)
}

export function getSessionId() {
  return localStorage.getItem(SESSION_ID)
}

export function removeSessionId() {
  return localStorage.removeItem(SESSION_ID)
}

export const copyToClipboard = (text: string) => {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(text).then(function() {
      resolve('复制到剪切板成功!');
    }).catch(function(error) {
      reject('复制失败: ' + error);
    });
  })
}