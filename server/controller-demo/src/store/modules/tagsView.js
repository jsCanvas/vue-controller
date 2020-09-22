const state = {
    visitedViews: [],
    cachedViews: [],
    exclude:['workbench','client-detail','message-list', 'to-proprietary', 'verify-rule', 'rule-detail', 'rule-edit', 'verify-question', 'group-manager', 'email-manager', 'intelligent-part', 'detail-template', 'speed-rate-manage', 'scene-averaging', 'customer-state','main-detail','child-detail'],
    cachedPath: {
        'workbench': [],
        'main-detail': []
    }
}

const mutations = {
    ADD_VISITED_VIEW: (state, view) => {
        if (state.visitedViews.some(v => v.path === view.path)) return
        state.visitedViews.push(
            Object.assign({}, view, {
                title: view.meta.title || 'no-name'
            })
        )
    },
    ADD_CACHED_VIEW: (state, view) => {
        var cachedPath = state.cachedPath[view.name];
        if (cachedPath && !cachedPath.includes(view.path)) {
            cachedPath.push(view.path);
        }
        // if(view.name == 'workbench'){
        //     if (state.cachedViews.includes(view.path.replace(/\//g,""))){
        //         return
        //     }
        //     if (!view.meta.noCache) {
        //         state.cachedViews.push(view.path.replace(/\//g,""))
        //     }
        // }else{
        if (state.cachedViews.includes(view.name)) {
            return
        }
        if (!view.meta.noCache) {
            state.cachedViews.push(view.name)
        }
        // }
    },

    DEL_VISITED_VIEW: (state, view) => {
        var ret =  '';

        for (const [i, v] of state.visitedViews.entries()) {
            if (v.path === view.path || v.path.indexOf(view.path) > -1) {
                state.visitedViews.splice(i, 1)
                break
            }
        }
    },
    DEL_CACHED_VIEW: (state, view) => {
        var cachedPath = state.cachedPath[view.name];
        if (cachedPath && cachedPath.includes(view.path)) {
            let index = cachedPath.indexOf(view.path);
            cachedPath.splice(index, 1)
        }
        if ('workbench' == view.name && cachedPath && cachedPath.length) {
        // if ('workbench' == view.name ) {
        //     for (const i of state.cachedViews) {
        //         if (i === view.path.replace(/\//g,"")) {
        //             const index = state.cachedViews.indexOf(i)
        //             state.cachedViews.splice(index, 1)
        //             state.exclude.push(i);
        //             break
        //         }
        //     }
        }else{
        for (const i of state.cachedViews) {
            if (i === view.name) {
                const index = state.cachedViews.indexOf(i)
                state.cachedViews.splice(index, 1)
                break
            }
        }
        }
    },

    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
        state.visitedViews = state.visitedViews.filter(v => {
            if(v.name == '首页'){
                return true;
            }else if(v.path == view.path){
                return true;
            }else{
                return false;
            }
        })
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
        var allview = [];
        var current = [];
        function deepCopy(obj1) {
            var obj2 = Array.isArray(obj1) ? [] : {};
            if (obj1 && typeof obj1 === "object") {
                for (var i in obj1) {
                    if (obj1.hasOwnProperty(i)) {
                         // 如果子属性为引用数据类型，递归复制
                        if (obj1[i] && typeof obj1[i] === "object") {
                            obj2[i] = deepCopy(obj1[i]);
                        } else {
                        // 如果是基本数据类型，只是简单的复制
                            obj2[i] = obj1[i];
                        }
                    }
                }
            }
            return obj2;
        };
        allview = deepCopy(state.cachedViews);
        for (const i of state.cachedViews) {
            if (i.indexOf('workbench')!=-1) {
                const index = allview.indexOf(i)
                var nowview = allview.splice(index, 1);
                current = current.concat(nowview);
            }
        }
        state.cachedViews = current;
    },

    DEL_ALL_VISITED_VIEWS: state => {
        // keep affix tags
        const affixTags = state.visitedViews.filter(tag => {
            if(tag.meta.affix){
                return tag.meta.affix
            }else if(tag.meta && tag.meta.icon == 'workbench'){
                return true;
            }else{
                return tag.meta.affix
            }
            
        })
        state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS: state => {
        let pathName = Object.keys(state.cachedPath);
        pathName.forEach(name => {
            state.cachedPath[name] = [];
        });
        state.cachedViews = []
    },

    UPDATE_VISITED_VIEW: (state, view) => {
        for (let v of state.visitedViews) {
            if (v.path === view.path) {
                v = Object.assign(v, view)
                break
            }
        }
    }
}

const actions = {
    addView({ dispatch }, view) {
        dispatch('addVisitedView', view)
        dispatch('addCachedView', view)
    },
    addVisitedView({ commit }, view) {
        commit('ADD_VISITED_VIEW', view)
    },
    addCachedView({ commit }, view) {
        commit('ADD_CACHED_VIEW', view)
    },
    delView({ dispatch, state }, view) {
        return new Promise(resolve => {
            dispatch('delVisitedView', view)
            dispatch('delCachedView', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delViewArr({ dispatch, state }, viewArr) {
        return new Promise(resolve => {
            viewArr.forEach(function(view, insex){
                dispatch('delVisitedView', view)
                dispatch('delCachedView', view)
            })

            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delVisitedView({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_VISITED_VIEW', view)
            resolve([...state.visitedViews])
        })
    },
    delCachedView({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_CACHED_VIEW', view)
            resolve([...state.cachedViews])
        })
    },

    delOthersViews({ dispatch, state }, view) {
        return new Promise(resolve => {
            dispatch('delOthersVisitedViews', view)
            dispatch('delOthersCachedViews', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delOthersVisitedViews({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_OTHERS_VISITED_VIEWS', view)
            resolve([...state.visitedViews])
        })
    },
    delOthersCachedViews({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_OTHERS_CACHED_VIEWS', view)
            resolve([...state.cachedViews])
        })
    },

    delAllViews({ dispatch, state }, view) {
        return new Promise(resolve => {
            dispatch('delAllVisitedViews', view)
            dispatch('delAllCachedViews', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delAllVisitedViews({ commit, state }) {
        return new Promise(resolve => {
            commit('DEL_ALL_VISITED_VIEWS')
            resolve([...state.visitedViews])
        })
    },
    delAllCachedViews({ commit, state }) {
        return new Promise(resolve => {
            commit('DEL_ALL_CACHED_VIEWS')
            resolve([...state.cachedViews])
        })
    },

    updateVisitedView({ commit }, view) {
        commit('UPDATE_VISITED_VIEW', view)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
