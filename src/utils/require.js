import Axios from "axios";

let apiUrl
let request
if(process.env.NODE_ENV === 'development'){

  // apiUrl = "http://cft.todosoft.com.cn"
  // apiUrl = 'http://192.168.1.127:8080/iadmin.web'
  Axios.get('./serverconfig.json').then((result) => {
    apiUrl = result.data.ApiUrl
    const serve = Axios.create({
      baseURL: apiUrl,
    });
    console.log(apiUrl)
    request = (api, method = "post") => {
        let uri = api;
        return serve({
          url: uri,
          method: method,
          headers:{
            token:localStorage.getItem('token')||null
          }
        })
    };
  }).catch((error) => { console.log(error) });
}else{
  Axios.get('serverconfig.json').then((result) => {
    apiUrl = result.data.ApiUrl
    const serve = Axios.create({
      baseURL: apiUrl,
    });
    console.log(apiUrl)
    request = (api, method = "post") => {
        let uri = api;
        return serve({
          url: uri,
          method: method,
          headers:{
            token:localStorage.getItem('token')||null
          }
        })
    };
  }).catch((error) => { console.log(error) });
}
export default request;



  