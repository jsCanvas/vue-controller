import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import sessionData from '@/utils/sessionData'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    withCredentials: true,
    crossDomain: true,
    timeout: 60000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'No-Redirect': 'Y',
        'Access-Control-Allow-Credentials': true
    }
})

service.interceptors.request.use(
    config => {
        if (config.method === 'get') {
            config.data = {unused: 0} // 这个是关键点，加入这行就可以了  解决get  请求添加不上content_type 
        }
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

export const postRequest = (url, data, {showErrMsg = false} = {}) => {
    let withoutData = data && data.hasOwnProperty('showErrMsg')
    let session;
    if (session = sessionData(url, data)) {
        return Promise.resolve(session);

    }
    return service({
        url: url,
        method: 'post',
        data: withoutData ? undefined : data
    }).then(res => {
        if (res.code == '0') {
            sessionData(url, data, res);
            return res
        } else {
            if(showErrMsg || (withoutData && data.showErrMsg === true)) {
                Message({
                    message: res.message || '出错了，请稍后再试！',
                    type: 'error'
                })
            }
            console.log(`error api：${url}`)
            throw res
        }
    })
}

export const postDown = (url, data, {showErrMsg = false} = {}) => {
    let withoutData = data && data.hasOwnProperty('showErrMsg')
    return service({
        url: url,
        method: 'post',
        data: withoutData ? undefined : data
    }).then(res => {
        return res
    })
}



export default service
