
/*
 * @author: tingyan.lty
 * @description: 请求层
 */
export default function request(url: string, method: 'post' | 'get' = 'get', params?: Record<string, any>) {
  return new Promise((resolve, reject) => {
    try {
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })
      .then((response) => response.json())
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
    } catch (error) {
      reject(error);
    }
  });
}