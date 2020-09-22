import Mock from 'mockjs'
import axios from 'axios'
import {param2Obj} from '../utils'

import users from './modules/user'
import control from './modules/control'

const mocks = [
    ...users,
    ...control,
];

const service = axios.create({
    baseURL: 'http://localhost:1443',
    withCredentials: true,
    crossDomain: true,
    timeout: 120000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'No-Redirect': 'Y',
        'Access-Control-Allow-Credentials': true
    }
})

service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)


service.interceptors.response.use(
    response => {
        const res = response.data
        // console.log("=================== res:",res);
        // if (res.code !== '0') {
        //     // Message({
        //     //     message: res.message || '操作错误，请稍后在试！',
        //     //     type: 'error',
        //     //     duration: 5 * 1000
        //     // })
        //     // return Promise.reject(new Error(res.message || 'Error'))

        // } else {

        // }
        if(res.code == 401){
            Message({
                message: '服务超时，请重新登录系统。',
                type: 'error',
                duration: 5 * 1000
            })
        }
        return res
    },
    error => {
        // if(error.message == 'Network Error'){
        //     Message({
        //         message: '服务超时，请重新登录系统。',
        //         type: 'error',
        //         duration: 5 * 1000
        //     })
        // }
        if(error.message.indexOf(401) > -1){
            Message({
                message: '服务超时，请重新登录系统。',
                type: 'error',
                duration: 5 * 1000
            })
        }
        console.log('err' + error)
        // 去掉提示
        // Message({
        //     message: error.message || '操作错误，请稍后在试！',
        //     type: 'error',
        //     duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

const postRequest = (url, data, {showErrMsg = false} = {}) => {
    let withoutData = data && data.hasOwnProperty('showErrMsg')
    
    return service({
        url: url,
        method: 'post',
        data: withoutData ? undefined : data
    }).then(res => {
        if (res.code == '0') {
            return res
        } else {
            if(showErrMsg || (withoutData && data.showErrMsg === true)) {
                
            }
            console.log(`error api：${url}`)
            throw res
        }
    })
}
// for front mock
// console.log(mocks);
// postRequest('/mocks',{mock:mocks});
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
export function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.withCredentials = true
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = true

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

// for mock server
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`/mock${url}`),
    type: type || 'get',
    response(req, res) {
      console.log(`mock api: ${url}`);
      if(url == '/control/router'){
        postRequest('/router',req.body);
      }else if(url == '/control/api'){
        postRequest('/mocks',req.body);
      }
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})
