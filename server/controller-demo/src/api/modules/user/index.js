
const tokens = {
    admin: {
      token: 'admin-token'
    },
    editor: {
      token: 'editor-token'
    }
  }
  
  export default [
    // get user info
    // passportadmin
    {
      url: '/passportadmin',
      type: 'get',
      modules:'user',//所属模块  /model1/model2
      res: {"code":"200","message":"成功","datas":{"id":2637,"email":"bitao.ren@msxf.com","name":"任碧涛","department":"市场运营研发部-前端团队","title":"WEB开发工程师","menuVOList":[{"id":13400,"url":null,"index":1,"name":"订单管理","parentId":0,"icon":null,"code":"system-manager","children":[{"id":13402,"url":null,"index":1,"name":"订单列表","parentId":13400,"icon":null,"code":"order-list","children":[]}]},{"id":15972,"url":null,"index":2,"name":"用户管理","parentId":0,"icon":null,"code":"member-manager","children":[{"id":15989,"url":null,"index":1,"name":"用户列表","parentId":15972,"icon":null,"code":"user-list","children":[]}]}]}},//mock数据
      params: {Headers:{value:'application/json',text:'Content-Type'}},//入参列表及说明
      name:'获取登录用户信息及菜单',//接口说明
      wiki:'http://10.193.198.64:3000/project/16/interface/api/167',//wiki地址
      response: config => {
        //"id":-5108897278153796,"url":"ni@WMkD","index":-7718931209578524,"name":"kXFO8[N","parentId":-7373510835696032,"icon":"4OLQjW","code":"bwryn3","children"
          return {"code":"200","message":"成功","datas":{"id":2637,"email":"bitao.ren@msxf.com","name":"任碧涛","department":"市场运营研发部-前端团队","title":"WEB开发工程师","menuVOList":[{"id":13400,"url":null,"index":1,"name":"订单管理","parentId":0,"icon":null,"code":"system-manager","children":[{"id":13402,"url":null,"index":1,"name":"订单列表","parentId":13400,"icon":null,"code":"order-list","children":[]}]},{"id":15972,"url":null,"index":2,"name":"用户管理","parentId":0,"icon":null,"code":"member-manager","children":[{"id":15989,"url":null,"index":1,"name":"用户列表","parentId":15972,"icon":null,"code":"user-list","children":[]}]}]}}
      }
    },
    // user logout
    {
      url: '/user/logout',
      type: 'post',
      modules:'user',//所属模块  /model1/model2
      params: {id:{value:10,text:'说明'}},//入参列表及说明
      name:'登出接口',//接口说明
      wiki:'http://wiki.msxf.com/1000',//wiki地址
      res: {
          code: 20000,
          data: 'success'
        },
      response: _ => {
        return {
          code: 20000,
          data: 'success'
        }
      }
    },

  ]