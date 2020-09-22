import { dataDictionary, organizationList, getIccUrl, getIccAccount } from '@/api/common'

const adapterChildrenData = function(data){
    data.forEach(function(item, itemIndex){
        item.label = item.orgName;
        item.value = item.id;

        if(item.children){
            item.children = adapterChildrenData(item.children);
        }
    })
    return data;
}

const state = {
    iccUrl: '',
    iccAccount: [],
    iccCofig: {},
    createWorksheetArr: [],
    worksheetDetailMoble: [],
    recordData: {
        searchUrl: '',
        currentTime: 0,
        toPlayTime:'aotoplay',
        play: 1,
        playbackRate: 1,
        status: '',
        isPlay: false,
        isDestory: false
    }
}

const mutations = {
    SET_ICC_URL: (state, data) => {
         state.iccUrl = data
    },
    SET_ICC_ACCOUNT: (state, data) => {
        state.iccAccount = data
    },
    SET_ICC_CONFIG: (state, data) => {
        state.iccCofig = data;
    },
    SET_WORKSHEET_OBJ: (state, data) => {
        state.createWorksheetArr.push(data);
    },
    DELETE_WORKSHEET_OBJ: (state, data) => {
        for (const [i, v] of state.createWorksheetArr.entries()) {
            if (v.workOrderNumber === data.workOrderNumber) {
                state.createWorksheetArr.splice(i, 1)
                break
            }
        }
    },
    MODIFY_WORKSHEET_OBJ: (state, data) => {
        for (const [i, v] of state.createWorksheetArr.entries()) {
            if (v.workOrderNumber === data.workOrderNumber) {
                var tmpObj = state.createWorksheetArr.splice(i, 1)[0];

                data = Object.assign({}, tmpObj, data);
                state.createWorksheetArr.push(data)
                break
            }
        }
    },
    SET_WORKSHEET_DETAIL_MOBILE: (state, data) =>{
        state.worksheetDetailMoble.push(data)
    },
    DELETE_WORKSHEET_DETAIL_MOBILE: (state, data) =>{
        for (const [i, v] of state.worksheetDetailMoble.entries()) {
            if (v.workOrderNumber === data.workOrderNumber) {
                state.worksheetDetailMoble.splice(i, 1)
                break
            }
        }
    },
    SET_RECORDDATA: (state, data) => {
        state.recordData = Object.assign(state.recordData, data);
    }
}

const actions = {
    dataDictionary({ commit, state }, data) {
        var routerList = [],
            menuList = [];

        return new Promise((resolve, reject) => {
            dataDictionary(data).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    setWorksheetObj({ commit, state }, data){
        commit('SET_WORKSHEET_OBJ',data);
    },
    deleteWorksheetObj({ commit, state }, data){
        console.log("+++++++++++++++ deleteWorksheetObj：",data);
        commit('DELETE_WORKSHEET_OBJ',data);
    },
    modifyWorksheetObj({ commit, state }, data){
        commit('MODIFY_WORKSHEET_OBJ',data);
    },
    setRecordData({ commit, state }, data){
        commit('SET_RECORDDATA',data);
    },
    organizationList({ commit, state }, data){

        return new Promise((resolve, reject) => {
            organizationList(data).then(response => {
                let { result } = response

                result.forEach(function(item, itemIdex){
                    item.label = item.orgName;
                    item.value = item.id;

                    if(item.children){
                        item.children = adapterChildrenData(item.children)
                    }
                });

                resolve(result)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getIccConfig({ commit, state }, data){
        return new Promise((resolve, reject) => {
            // getIccUrl(data).then(response => {
            //     if(response.code == '0'){
            //         commit('SET_ICC_CONFIG', response.result);
            //     }else{
            //         commit('SET_ICC_CONFIG', false);
            //     }

            //     resolve(data)
            // }).catch(error => {
            //     reject(error)
            // })
        })
    },
    getIccAccount({ commit, state }, data){
        return new Promise((resolve, reject) => {
            // getIccAccount(data).then(response => {
            //     if(response.code == '0'){
            //         commit('SET_ICC_ACCOUNT', response.result);
            //     }else{
            //         commit('SET_ICC_ACCOUNT', {});
            //     }

            //     resolve(data)
            // }).catch(error => {
            //     reject(error)
            // })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

