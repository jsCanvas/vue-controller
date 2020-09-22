import axios from 'axios'
import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth'

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
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        // code 为 ‘0’即请求成功
        if (res.code !== '0') {
            Message({
                message: res.message || '操作错误，请稍后在试！',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(new Error(res.message || 'Error'))
        } else if(res.code == 401){
            Message({
                message: '服务超时，请重新登录系统。',
                type: 'error',
                duration: 5 * 1000
            })
        }else{
            return res
        }
    },
    error => {
        if(error.message.indexOf(401) > -1){
            Message({
                message: '服务超时，请重新登录系统。',
                type: 'error',
                duration: 5 * 1000
            })
        }
        return Promise.reject(error)
    }
)

export const postRequest = (url, data) => {
    return service({
        url: url,
        method: 'post',
        data: data
    }).then(res => {
        if (res.code === '0') {
            return res
        } else {
            throw res
        }
    })
}

