import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
    {
        path: '/',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: 'index',
                name: '首页',
                component: () => import('@/views/home/index'),
                meta: {
                    affix: true,
                    title: '首页',
                    icon: 'home',
                    activeMenu: '/',
                    hidden: false,
                    name: 'index',
                    permission: true
                }
            },{
                path: 'error',
                component: () => import('@/views/error'),
                name: '错误页',
                meta: {
                    permission: true,
                    //affix: true,
                    title: '错误页',
                    icon: 'error',
                    activeMenu: '/',
                    name: 'error',
                    permission: true
                },
                hidden: true
            }
        ]
    },
    {
        path: '*',
        beforeEnter: async function(to, from, next){
            var tempPath = [],
                isExsit = false,
                currentPath = to.path;

            if(store.getters.menu && !store.getters.menu.length){
                await store.dispatch('user/getInfo')
                router.addRoutes(store.getters.menu)
            }
            store.getters.menu.filter(function(item,index){
               item.children && item.children.filter(function(innerItem, innerIndex){
                    if(innerItem && innerItem.children){
                         getCompletePath(item, innerItem.path, tempPath);
                    }else{
                         tempPath.push(innerItem.path)
                    }
               })
            })

            tempPath.forEach(function(item, index){
               if(item == currentPath){
                   isExsit = true;
               }
            })

            if(isExsit){
                 next();
            }else{
                 next(`/error`)
            }
        },
        hidden: true
    }
]

const getCompletePath = (item, tempPath, pathArr) => {
    item.children && item.children.filter(function(childrenItem,childrenIndex){
        tempPath = tempPath+childrenItem.path;

        if(childrenItem.children && childrenItem.children.length){
            getCompletePath(childrenItem,tempPath,pathArr)
        }else{
            pathArr.push(tempPath);
        }
    });

    return pathArr;
}

const createRouter = () => new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router
