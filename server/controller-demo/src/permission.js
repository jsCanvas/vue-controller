import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
import request, { postRequest } from '@/utils/request'
import {requestApi} from '@/api/common'

NProgress.configure({ showSpinner: false })

router.beforeEach(async(to, from, next) => {
	NProgress.start();

	document.title = getPageTitle(to.meta.title)
	if(store.getters.menu && !store.getters.menu.length){
	    await store.dispatch('user/getInfo')

        console.log('++++++++++++++  per store.getters.menu',process.env.VUE_APP_BASE_API,store.getters.menu)
        /**
         * 如果是开发环境保存路由到控制器 
         * */
        if(process.env.VUE_APP_BASE_API.indexOf('/dev-api')!= -1){
            let dats = [];
            function reduc(arr){
                let params = [];
                arr.forEach(ob=>{
                    let cob = {};
                    for(let i in ob){
                        if(i == 'children'){
                            cob['children'] = reduc(ob.children)
                        }else
                        if(i != 'component'){
                            cob[i] = ob[i];
                        };
                    };
                    params.push(cob);
                })
                return params;
            }
            dats = reduc(store.getters.menu);
            postRequest('/control/router',{route:dats});
            requestApi();
        }
        var nowRoute = store.getters.menu.map(item=>{
            //if(item.name == 'worksheet-manager'){
                 item = delteFakeParent(item)
            //}
            return item
        });
        console.log(nowRoute) 
        nowRoute = nowRoute.filter(item => item.path);
	    router.addRoutes(nowRoute || store.getters.menu)
	    if(store.state.tagsView.visitedViews && !store.state.tagsView.visitedViews.length){
	    	next({
	    		path: '/index'
	    	})
	    }else{
	    	next({ ...to})
	    }
    }else{
	  	next();
	}
})

router.onError(() => {
})

router.afterEach(() => {
    NProgress.done()
})

function delteFakeParent(router,prefix) {
    // console.log(router)
    var newRouter = { ...router }
    if(prefix){
        newRouter.path = prefix + '/' + router.path
    }

    if (!router.children) {
        return newRouter
    }

    var children = []

    if (router.noCompoent) {
        if(router.component){
            var nowRoute = Object.assign({}, router);
            delete nowRoute.children;
            children.push(nowRoute)
        }
        for (let i = 0; i < router.children.length; i++) {
            // console.log('+++++++++++++++++++++++++')
            const item = delteFakeParent(router.children[i], newRouter.path)
            if (Array.isArray(item)) {
                item.forEach(el => {
                    children.push(el)
                })
            }else{
                children.push(item)
            }
        }
        newRouter = children
    } else {
        for (let i = 0; i < router.children.length; i++) {
            const item = delteFakeParent(router.children[i])
            if (Array.isArray(item)) {
                item.forEach(el => {
                    children.push(el)
                })
            }else{
                children.push(item)
            }
        }
        newRouter.children = children
    }

    return newRouter
}
