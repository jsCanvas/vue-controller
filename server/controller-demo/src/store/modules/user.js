// import { logout, getInfo, loginUser,getCallList,getMessageList,findUserNameByIccAccount } from '@/api/user'
import {commonRequest} from '@/api/controller-common'
import { resetRouter } from '@/router'
import createRouterMap from '@/router/generate-routes'
function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i])
      }
    }
    return newArray
  }
 
 function param(json) {
    if (!json) return ''
    return cleanArray(Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' +
             encodeURIComponent(json[key])
    })).join('&')
  }
const state = {
    user: {},
    menu: [],
}
const mutations = {
    SET_USER: (state, data) => {
         state.user = data
    },
    SET_MENU: (state, data) => {
         state.menu = data
    }
}
const actions = {
    // get user info
    getInfo({ commit, state }) {
        var routerList = [],
            menuList = [];

        return new Promise((resolve, reject) => {
            commonRequest('/passportadmin','get',state.token).then(response => {
                const { datas } = response
                
                routerList = createRouterMap(datas && datas.menuVOList || [])

                commit('SET_MENU', routerList);
                commit('SET_USER', {
                    name: (datas && datas.name) || '',
                    department: (datas && datas.department) || '',
                    email: (datas && datas.email) || '',
                    userId: (datas && datas.userId) || '',
                    title: (datas && datas.title) || '',
                    roleList: (datas && datas.roleList) || ''
                });
                resolve(datas)
            }).catch(error => {
                reject(error)
            })
        })
    },
    loginUser({ commit, state }){
        return new Promise((resolve, reject) => {
            // loginUser().then(response => {
            //     const { result } = response;
            //     commit('SET_USER_DETAIL_MESSAGE', result);
            //     resolve(result)
            // }).catch(error => {
            //     reject(error)
            // })
        })
    },
    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            // logout().then(() => {
            //     resetRouter()
            //     resolve()
            // }).catch(error => {
            //     reject(error)
            // })
        })
    },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}

