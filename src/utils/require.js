import Axios from "axios";
let apiUrl
let serve = function(){}  //先定义方法
if(process.env.NODE_ENV === 'development'){ //开发环境 请求json 获取接口地址
  // apiUrl = "http://cft.todosoft.com.cn"
  // apiUrl = 'http://192.168.1.127:8080/iadmin.web'
  Axios.get('./serverconfig.json').then((result) => {
    apiUrl = result.data.ApiUrl
    serve = Axios.create({
      baseURL: apiUrl,
    });
  }).catch((error) => { console.log(error) });
}else{
  Axios.get('serverconfig.json').then((result) => {
    apiUrl = result.data.ApiUrl
    serve = Axios.create({
      baseURL: apiUrl,
    });
  }).catch((error) => { console.log(error) });
}
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



  