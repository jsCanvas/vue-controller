module.exports = [
    {
        url: '/user/wordlist',
        type: 'post',
        modules:'user',//所属模块  /model1/model2
        params: {"id":{"value":10,"text":"说明"}},//入参列表及说明
        name:'用户列表',//接口说明
        wiki:'http://wiki.msxf.com',//wiki地址
        res: {"code":200,"datas":{"list":[{"name":123,"age":23,"city":"北京"}]}},
        response: _ => {
            return {"code":200,"datas":{"list":[{"name":123,"age":23,"city":"北京"}]}}
        }
    }
]