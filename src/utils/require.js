import Axios from "axios";
import router from '../routes'

// Axios.get('serverconfig.json').then((result) => {
//   let apiUrl = result.data.ApiUrl
//   localStorage.setItem("apiUrl",apiUrl)
// }).catch((error) => { console.log(error) });
const apiUrl = 'http://cft.todosoft.com.cn'
// const apiUrl = localStorage.getItem("apiUrl")
const serve = Axios.create({
  baseURL: apiUrl,
});
// serve.interceptors.response.use(
//   res => {
//     if (!res.data.success) {
//       // let path = router.history.current.fullPath
//       alert("登录已过期，请重新登录！")
//       router.replace({
//         path: '/login'
//     })
//       return;
//     }
//     return res;
//   },
//   error => {
//     return error;
//   }
// );

const request = (api, method = "post") => {
  let uri = api;
  return serve({
    url: uri,
    method: method,
    headers:{
      token:localStorage.getItem('token')||null
    }
  })
};
export default request;



  