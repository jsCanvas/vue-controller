#!/usr/bin/env node
const app = require('express')();
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
/**
 * Module dependencies.
 */
var debug = require('debug');
var http = require('http');
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
/**
 * Create HTTP server.
 */

var server = http.createServer(app);
async function lsExample() {
  const { stdout, stderr } = await exec('npm run dev');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
/**
 * 执行服务端渲染nuxt
 */
lsExample();

app.all("*", function(req, res, next) {
    //设置请求头
    //允许所有来源访问
    res.header('Access-Control-Allow-Origin', '*')
    //用于判断request来自ajax还是传统请求
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //允许访问的方式
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    //修改程序信息与版本
    res.header('X-Powered-By', ' 3.2.1')
    //内容类型：如果是post请求必须指定这个属性
    res.header('Content-Type', 'application/json;charset=utf-8')
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  console.log('收到请求：'+bind);
  next();
})
app.get('/hello', (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
  // var crouter = require('./data/route')().route;
  var readStream=fs.createReadStream('./server/data/route.js');

  var str='';/*保存数据*/
  var count=0;  /*次数*/
  readStream.on('data',function(chunk){
      str+=chunk;
      count++;

  })

  //读取完成
  readStream.on('end',function(chunk){
      console.log(count);
      // console.log(str);
      var routerlist = JSON.parse(str.split('module.exports = ')[1]);
      res.send(routerlist.route);
  })


  //读取失败
  readStream.on('error',function(err){
      console.log(err);

  })
})

app.get('/api', (req, res) => {
  //   res.setHeader("Access-Control-Allow-Origin", "*");
    // var crouter = require('./data/mocks')().mock;
    var readStream=fs.createReadStream('./server/data/mocks.js');

    var str='';/*保存数据*/
    var count=0;  /*次数*/
    readStream.on('data',function(chunk){
        str+=chunk;
        count++;

    })

    //读取完成
    readStream.on('end',function(chunk){
        console.log(count);
        // console.log(str);
        var apilist = JSON.parse(str.split('module.exports = ')[1]);
        res.send(apilist.mock);
    })


    //读取失败
    readStream.on('error',function(err){
        console.log(err);

    })
  })

app.post('/router', (req, res) => {
  console.log('收到router');
  var writerStream = fs.createWriteStream('./server/data/route.js');
  writerStream.write(`module.exports = ${JSON.stringify(req.body)}`,'utf8');

  //标记写入完成
  writerStream.end();

  writerStream.on('finish',function(){
      res.send('hello mocks!');
      console.log('router写入完成');
  })

  //失败
  writerStream.on('error',function(){
      res.send('hello mocks!');
      console.log('router写入失败');
  })
});

app.post('/mocks', (req, res) => {
  console.log('收到mocks');
  var writerStream = fs.createWriteStream('./server/data/mocks.js');
  writerStream.write(`module.exports = ${JSON.stringify(req.body)}`,'utf8');

  //标记写入完成
  writerStream.end();

  writerStream.on('finish',function(){
      res.send('hello mocks!');
      console.log('api写入完成');
  })

  //失败
  writerStream.on('error',function(){
      res.send('hello mocks!');
      console.log('api写入失败');
  })
});
/**
 * 添加api接口
 */
app.post('/addapi', (req, res) => {
    console.log('收到addapi',JSON.stringify(req.body));
    let models = req.body.model;
    let apiurl = req.body.url;
    let apiname = req.body.name;
    let apiparams = req.body.params;
    let apiwiki = req.body.wiki;
    let apires = req.body.res;
    let apitype = req.body.type;
    function wirtestapi(mudu,sta){
        var writerStream = null;
        if(mudu=='api'){
            writerStream = fs.createWriteStream(`../src/${mudu}/modules/${models}/index.js`);
        }else{
            writerStream = fs.createWriteStream(`../src/${mudu}/modules/${models}.js`);
        }
        writerStream.write(sta,'utf8');
    
        //标记写入完成
        writerStream.end();
    
        writerStream.on('finish',function(){
            // res.send('hello mocks!');
            if(mudu=='api'){
                apistore();
            }else if(mudu=='store'){
                apigetter();
            }
            console.log(mudu+'写入完成');
        })
    
        //失败
        writerStream.on('error',function(){
            res.send('hello mocks!');
            console.log(mudu+'写入失败');
        })
    }

    if (fs.existsSync(`../src/api/modules/${models}`)) {
        console.log('api该路径已存在');
    }else{
        console.log('api该路径不存在');
        fs.mkdir(`../src/api/modules/${models}`,function(){
            let apistr = `export default [
    {
        url: '${apiurl}',
        type: '${apitype}',
        modules:'${models}',//所属模块  /model1/model2
        params: ${apiparams},//入参列表及说明
        name:'${apiname}',//接口说明
        wiki:'${apiwiki}',//wiki地址
        res: ${apires},
        response: _ => {
            return ${apires}
        }
    }
]`;
            wirtestapi('api',apistr);
        })
        
        return;
    }
    var readStream=fs.createReadStream(`../src/api/modules/${models}/index.js`);

    var str='';/*保存数据*/
    var count=0;  /*次数*/
    readStream.on('data',function(chunk){
        str+=chunk;
        count++;

    })

    //读取完成
    readStream.on('end',function(chunk){
        console.log(count);
        // console.log(str);
        var apilistStr = str.slice(0,-1) + 
`  ,{
        url: '${apiurl}',
        type: '${apitype}',
        modules:'${models}',//所属模块  /model1/model2
        params: ${apiparams},//入参列表及说明
        name:'${apiname}',//接口说明
        wiki:'${apiwiki}',//wiki地址
        res: ${apires},
        response: _ => {
            return ${apires}
        }
    }
]`;
        wirtestapi('api',apilistStr);
        // res.send(apilist.mock);
    })


    //读取失败
    readStream.on('error',function(err){
        console.log(err);

    });

    /**
     * 写入store
     */
    function apistore(){
        let apirr = apiurl.split('/');
        let star1 = apirr[apirr.length-2];
        let star2 = apirr[apirr.length-1];
        if (fs.existsSync(`../src/store/modules/${models}.js`)) {
            console.log('store该路径已存在');
        }else{
            // models .toUpperCase( )
            // apiurl .tolocaleLowerCase( )   
            let storestr = `import {commonRequest} from '@/api/controller-common'
import {Message} from 'element-ui'
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
    /**
     * 规则 api路径最后两段驼峰
     * 例如接口 /member/list   type：get
     * memberList
     */
    ${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)}:[],
}

const mutations = {
    /**
     * 规则 接口类型type _ api路径最后两段驼峰
     * 例如接口 /member/list   type：get
     * GET_MEMBERLIST
     */
    ${apitype.toUpperCase()}_${star1.toUpperCase()+star2.toUpperCase()}:(state,data)=>{
        state.${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)} = data;
    },
    }


    const actions = {
    /**
     * 规则 接口类型type + api路径最后两段驼峰
     * 例如接口 /member/list   type：get
     * getMemberList
     */
    ${apitype+star1.slice(0,1).toUpperCase()+star1.slice(1)+star2.slice(0,1).toUpperCase()+star2.slice(1)}({ commit, state },data) {
        return new Promise((resolve, reject) => {
        commonRequest('${apitype=='post'?apiurl:apiurl+'?param(data)'}','${apitype}',data).then(response => {
            const { datas } = response;
            if(datas){
                commit('${apitype.toUpperCase()}_${star1.toUpperCase()+star2.toUpperCase()}',datas);
            }else{
                Message.error(response.message)
            }
            resolve(null)
        }).catch(error => {
            Message.error('服务出差啦~稍后再试/刷新页面')
            reject(error)
        })
            
        })
    },
    }


export default {
    namespaced: true,
    state,
    mutations,
    actions
}`
            wirtestapi('store',storestr);
            return;
    }

    let readStream=fs.createReadStream(`../src/store/modules/${models}.js`);

    let str='';/*保存数据*/
    let count=0;  /*次数*/
    readStream.on('data',function(chunk){
        str+=chunk;
        count++;

    })

    //读取完成
    readStream.on('end',function(chunk){
        console.log(count);
        // console.log(str);
        let storelistStr = '';
        let storeone = str.split('const state = ')[0];
        let storestwo = str.split('const state = ')[1];
        let storetate = storestwo.split('const mutations = ')[0];
        let stores3 = storestwo.split('const mutations = ')[1];
        let storemutation = stores3.split('const actions = ')[0];
        let stores4 = stores3.split('const actions = ')[1];
        let storeactions = stores4.split('export default ')[0];
        let stores5 = stores4.split('export default ')[1];
        storelistStr = storeone
        + 'const state = '+storetate.slice(0,storetate.lastIndexOf('}'))
        +`
    ${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)}:[],
}
const mutations = `+ storemutation.slice(0,storemutation.lastIndexOf('}'))
        +`
    ${apitype.toUpperCase()}_${star1.toUpperCase()+star2.toUpperCase()}:(state,data)=>{
        state.${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)} = data;
    },
}
const actions = `+ storeactions.slice(0,storeactions.lastIndexOf('}'))
        + `
    ${apitype+star1.slice(0,1).toUpperCase()+star1.slice(1)+star2.slice(0,1).toUpperCase()+star2.slice(1)}({ commit, state },data) {
        return new Promise((resolve, reject) => {
        commonRequest('${apitype=='post'?apiurl:apiurl+'?param(data)'}','${apitype}',data).then(response => {
            const { datas } = response;
            if(datas){
                commit('${apitype.toUpperCase()}_${star1.toUpperCase()+star2.toUpperCase()}',datas);
            }else{
                Message.error(response.message)
            }
            resolve(null)
        }).catch(error => {
            Message.error('服务出差啦~稍后再试/刷新页面')
            reject(error)
        })
            
        })
    },
}
export default `+stores5;
        wirtestapi('store',storelistStr);
        // res.send(apilist.mock);
    })


    //读取失败
    readStream.on('error',function(err){
        console.log(err);

    });

    };

    /**
     * 写入getter
     */
    function apigetter(){
        let apirr = apiurl.split('/');
        let star1 = apirr[apirr.length-2];
        let star2 = apirr[apirr.length-1];
        let readStream=fs.createReadStream(`../src/store/getters.js`);

        let str='';/*保存数据*/
        let count=0;  /*次数*/
        readStream.on('data',function(chunk){
            str+=chunk;
            count++;

        })

        //读取完成
        readStream.on('end',function(chunk){
            console.log(count);
            // console.log(str); userOrderList: state => state.member.userOrderList,
            let getters1 = str.split('export default ')[0];
            let getters2 = str.split('export default ')[1];
            let getterstr = getters1.slice(0,getters1.lastIndexOf('}'))
            +`  ${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)}: state => state.${models}.${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)},            
}
export default `+getters2;
        let writerStream = fs.createWriteStream(`../src/store/getters.js`);
        writerStream.write(getterstr,'utf8');
    
        //标记写入完成
        writerStream.end();
    
        writerStream.on('finish',function(){
            res.send('hello mocks!');
            
            console.log('getterstr写入完成');
        })
    
        //失败
        writerStream.on('error',function(){
            res.send('hello mocks!');
            console.log('getterstr写入失败');
        })
        })


        //读取失败
        readStream.on('error',function(err){
            console.log(err);

        })
    }
    // res.send('hello mocks!');
  });

/**
 * 添加页面接口
 */
app.post('/addpage', (req, res) => {
    function wirtestpage(pagepath,mudu,sta){
        return new Promise((resolve,reject)=>{
            let writerStream = fs.createWriteStream(pagepath);
        
            writerStream.write(sta,'utf8');
        
            //标记写入完成
            writerStream.end();
        
            writerStream.on('finish',function(){
                // res.send('hello mocks!');
                resolve(true);
                console.log(mudu+'写入完成');
            })
        
            //失败
            writerStream.on('error',function(){
                res.send('hello page!');
                reject(false);
                console.log(mudu+'写入失败');
            })
        })
        
    };

    function readpage(pathpage){
        return new Promise((resolve,reject)=>{
            let readStream=fs.createReadStream(pathpage);

            let str='';/*保存数据*/
            let count=0;  /*次数*/
            readStream.on('data',function(chunk){
                str+=chunk;
                count++;

            })

            //读取完成
            readStream.on('end',function(chunk){
                console.log(count);
                resolve(str);
                // res.send(apilist.mock);
            })


            //读取失败
            readStream.on('error',function(err){
                console.log(err);
                reject(err);
            });
        })
    };

    function nopagestr(model,path){
        let strpage = `<template>
<!-- 模块: ${model}
    path: ${path}
    component: @/views/${model}-manager/${path}/index 
    ref: ${model}-${path} -->
    <div
        ref = "${model}-${path}"
        class = "${model}-${path} marginTop16 paddingRL16">
        ${model}-${path}
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/utils/index.js' 
export default {
    name:'${model}-${path}',
    components: {
    },
    data() {
        return {
            initloading:false,
            form: {
                uniqueId: '',
                mobile: ''
            },
            tableData: [{"uniqueId":"tLD","startDate":1599709835,"endDate":1599709835,"autoPay":-8820872079645616,"memberFlag":false}],
            detailData: {},
            typePro: '',
            total: 0,
            instance: {},
            loginMessage: {},
            loading: false,
            queryData: {
                pageSize: 30,
                pageNum: 1
            }
        }
    },
    computed: {
        //数据源store
        //...mapGetters([
        //    
        //]),
    },
    watch:{
    },
    mounted(){
        this.init();
    },
    filters: {
        formatDate(time) {
        var date = new Date(time);
        return utils.parseTime(date, "{y}-{m}-{d}");
        }
    },  
    methods: {
        async init(){
            //获取初始数据
            //await this.get...();
        },
        //数据方法
        //getMemberList(page){
        //    var promise = new Promise( (resolve,reject) => { 
        //        // resolve(true)
        //        this.queryData =  Object.assign({},this.queryData,page||{});
        //        let params = Object.assign({},this.form,this.queryData);
        //        this.initloading = true;
        //        this.$store.dispatch('member/getMemberList',params).then(solve=>{
        //            this.initloading = false;
        //        }).catch(e=>{
        //            this.initloading = false;
        //        });;
        //    })
        //    return promise;
        //},
        handleSizeChange(val){
            this.getMemberList({
                pageNum: 1,
                pageSize: val
            })
        },
        handleCurrentChange(val){
            this.getMemberList({
                pageNum: val
            })
        }
    }
}
</script>

<style lang = "scss" scoped>

</style>`;
        return strpage;
    };

    function nopageroute(modelss,modelname,pagespath,pagesname){
        let thispageroute = `import Layout from '@/layout'
const ${modelss}ManagerConfig = {
    /**
     * @path
     * 规则 ${modelss} '-manager' 
     * 例如模块 ${modelss}
     * ${modelss}-manager
     */
    path: '/${modelss}-manager',
    component: Layout,
    hidden: true,
    name: '${modelss}-manager',
    meta: {
        title: '${modelname}',
        icon: 'client-manager',
        permission: false
    },
    redirect: '/${modelss}-manager/${pagespath}',
    alwaysShow: true,
    children: [
        {
            /**
             * 规则 ${modelss} '-' ${pagespath}
             * 例如path ${pagespath}
             * ref ： '${modelss}-${pagespath}'
             * 
             * @component 
             * 规则 '@/views/'+ 模块path '/${modelss}-manager/' + path '/${pagespath}/' + index
             * 例如path ${pagespath}
             * component ： () => import('@/views/${modelss}-manager/${pagespath}/index')
             */
            path: '${pagespath}',
            component: () => import('@/views/${modelss}-manager/${pagespath}/index'), 
            name: '${modelss}-${pagespath}',
            hidden: true,
            meta: { 
                title: '${pagesname}',
                permission: false,
                keepAlive: true,
                ref: '${modelss}-${pagespath}'
            },          
        },
    ]
}
export default ${modelss}ManagerConfig
`;
        return thispageroute;
    }

    let models = req.body.model;
    let pagepath = req.body.path;
    let pagename = req.body.name;
    let modesname = req.body.modelname;
    if (fs.existsSync(`../src/views/${models}-manager`)) {
        console.log('page model该路径已存在');
        /**判断页面是否存在 */
        if (fs.existsSync(`../src/views/${models}-manager/${pagepath}`)) {
            console.log('page该路径已存在');
        }else{
            console.log('page该路径不存在');
            fs.mkdir(`../src/views/${models}-manager/${pagepath}`,function(){
                let thispage = nopagestr(models,pagepath);
                wirtestpage(`../src/views/${models}-manager/${pagepath}/index.vue`,'page',thispage).then(rel=>{
                    // res.send('hello pages!');
                    readpage(`../src/router/modules/${models}/index.js`).then(routestr=>{
                        let routes1 = routestr.split('export default ')[0];
                        let routes2 = routestr.split('export default ')[1];
                        let changeroute = routes1.slice(0,routes1.lastIndexOf(']'))
+`
        {
            path: '${pagepath}',
            component: () => import('@/views/${models}-manager/${pagepath}/index'), 
            name: '${models}-${pagepath}',
            hidden: true,
            meta: { 
                title: '${pagename}',
                permission: false,
                keepAlive: true,
                ref: '${models}-${pagepath}'
            },          
        },
`+routes1.slice(routes1.lastIndexOf(']'))
+'export default '+routes2;
                        wirtestpage(`../src/router/modules/${models}/index.js`,'route',changeroute).then(oksl=>{
                            res.send('hello pages!');
                        });
                        
                    });
                });
            });
            return;
        }
    }else{
        console.log('page model该路径不存在');
        fs.mkdir(`../src/views/${models}-manager`,function(){
            fs.mkdir(`../src/views/${models}-manager/${pagepath}`,function(){
                let thatpage = nopagestr(models,pagepath);
                wirtestpage(`../src/views/${models}-manager/${pagepath}/index.vue`,'page',thatpage).then(rel=>{
                    // 写模块路由
                    fs.mkdir(`../src/router/modules/${models}`,function(){
                        let thismodelstr = nopageroute(models,modesname,pagepath,pagename);
                        wirtestpage(`../src/router/modules/${models}/index.js`,'route',thismodelstr).then(oksl=>{
                            res.send('hello pages!');
                        })
                    });
                });
            });
        });
        
        return;
    };
    /**页面已存在 逻辑 */
    res.send('hello pages!');
});
/**
 * Get port from environment and store in Express.
 */

var port = 1443;
app.set('port', port);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function(){
    console.log('端口号： %s http://localhost:3000',3000 );
    console.log('API端口号： %s',port );
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

// module.exports = {
//   path: 'api',
//   handler: app
// }