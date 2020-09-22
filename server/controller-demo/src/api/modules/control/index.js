import Mock from 'mockjs'

const data = Mock.mock({
    'List|20': [{
        userName: '@sentence(2, 5)',
        status: '@sentence(1, 2)',
        roles: ['published', 'draft', 'deleted'],
        department: '@FIRST',
        workplace: '@FIRST',
        createUser: '@FIRST',
        createTime: '@datetime',
        'id|+1': 3
    }]
})

export default [
    {
        url: '/control/router',
        type: 'post',
        modules:'control',//所属模块  /model1/model2
        params: {id:{value:10,text:'说明'}},//入参列表及说明
        name:'获取用户菜单及权限接口',//接口说明
        wiki:'http://wiki.msxf.com/1000',//wiki地址
        res:{
            code: 0,
            data: {}
        },
        response: config => {
            const { List } = data;
            console.log("++++++++++++++++++++++ items:"+List);
            return {
                code: 0,
                data: {}
            }
        }
    },
    {
        url: '/control/api',
        type: 'post',
        modules:'control',//所属模块  /model1/model2
        params: {id:{value:10,text:'说明'}},//入参列表及说明
        name:'获取用户菜单及权限接口',//接口说明
        res:{
            code: 0,
            data: {name:1}
        },
        wiki:'http://wiki.msxf.com/1000',//wiki地址
        response: config => {
            const { List } = data;
            console.log("++++++++++++++++++++++ items:"+List);
            return {
                code: 0,
                data: {}
            }
        }
    }
]
