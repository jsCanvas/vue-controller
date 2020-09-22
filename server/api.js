#!/usr/bin/env node
'use strict';
const fs = require('fs');
const inquirer = require('inquirer');

const chalk = require('chalk');
const semver = require('semver');
const program = require('commander');
const cwd = process.cwd();
const path = require('path');
const init = require('./init');
const pages = require('./page');
const mkreduce = require('./mkdirs');
let thisapimodel = '';
let thisdiaoyong = '';
let thisshujucangku = '';
let thisapiurl = '';
function checkNodeVersion(version){
    if (semver.lt(process.version, version)) {
        // eslint-disable-next-line
        console.log(
            chalk`nanachi only support {green.bold v8.6.0} or later (current {green.bold ${
                process.version
            }}) of Node.js`
        );
        process.exit(1);
    }
}
checkNodeVersion('8.6.0');
function haveDou(str){
    if(str.lastIndexOf('}')<str.lastIndexOf(',')){
        return '';
    }else if(str.lastIndexOf('}')>str.lastIndexOf(',')){
        return ',';
    }
}
/**保存更改 */
const wsaveapi = (reqsave) => {
    let tplSrc = path.join( __dirname, '.',  'data','mocks.js');
    var writerStream = fs.createWriteStream(tplSrc);
    writerStream.write(`module.exports = ${JSON.stringify(reqsave)}`,'utf8');
  
    //标记写入完成
    writerStream.end();
  
    writerStream.on('finish',function(){
        // res.send('hello mocks!');
        console.log('api保存完成');
    })
  
    //失败
    writerStream.on('error',function(){
        // res.send('hello mocks!');
        console.log('api写入失败');
    })
};
/**入参出参 */
const askparams = () => {
    return inquirer.prompt({
        type: 'input', // 问题类型，包括input，number，confirm，list，rawlist，password
        name: 'inparams', 
        message: '请输入【入参JSON】', // 问题
        default: '{"id":{"value":10,"text":"说明"}}', // 默认值
        validate: (input) => {
            return true;
        }        
    });
};
const askoutparams = () => {
    return inquirer.prompt({
        type: 'input', // 问题类型，包括input，number，confirm，list，rawlist，password
        name: 'outparams', 
        message: '请输入【Mock返回值JSON】', // 问题
        default: '{"code":200,"datas":{"list":[{"name":123,"age":23,"city":"北京"}]}}', // 默认值
        validate: (input) => {
            return true;
        }        
    });
};
function saveapi(strs){
    let tplSrc = path.join( __dirname, '.',  'data','mocks.js');
    var readStream=fs.createReadStream(tplSrc);
    var str='';/*保存数据*/
    var count=0;  /*次数*/
    readStream.on('data',function(chunk){
        str+=chunk;
        count++;

    })

    //读取完成
    readStream.on('end',function(chunk){
        // console.log(count);
        // console.log(strs);
        var apilist = JSON.parse(str.split('module.exports = ')[1]);
        apilist.mock.push(strs);
        wsaveapi(apilist);
        // res.send(apilist.mock);
    })


    //读取失败
    readStream.on('error',function(err){
        console.log(err);

    })
}
/**
 * 注册命令
 * @param {String} command 命令名
 * @param {String} desc 命令描述
 * @param {Object} options 命令参数
 * @param {Function} action 回调函数
 */
function registeCommand(command, desc, options = {}, action) {
    const cmd = program.command(command).description(desc);
    Object.keys(options).forEach(key => {
        const option = options[key];

        cmd.option(`${option.alias ? '-' + option.alias + ' ,' : ''}--${key}`, option.desc);
    });
    cmd.action(action);
}

//获取参数的布尔值
function getArgValue(cmd){
    let args = {};
    cmd.options.forEach(function(op){
        let key = op.long.replace(/^--/, '');
        //commander中会把 --beta-ui 风格的参数变为cmd上betaUi驼峰
        //beta-ui => betaUi
        key = key.split('-').map((el, index)=>{
            return index > 0 ? `${el[0].toUpperCase()}${el.slice(1)}` : el;
        }).join('');
        
        if (typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key];
        }
    });
    return args;
}

program
    .version(require('../package.json').version)
    .usage('<command> [options]');

// ['page', 'component'].forEach(type => {
//     registeCommand(
//         `${type} <page-name>`,
//         `description: 创建${type}s/<${type}-name>/index.js模版`,
//         {}, 
//         (name)=>{
//             const isPage = type === 'page';
//             require('../commands/createPage')( {name, isPage} );
//         });
// });

async function api(apiUrl){
    const  answers  = await askapi();
        console.log(apiUrl);
        console.log(answers.name);
        console.log(answers.model);
        console.log(answers.type);
   
let models = answers.model;
let apiurl = apiUrl;
let apiname = answers.name;
let apiparams = '{"id":{"value":10,"text":"说明"}}';
let apiwiki = "http://wiki.msxf.com";
let apires = '{"code":200,"datas":{"list":[{"name":123,"age":23,"city":"北京"}]}}';
let apitype = answers.type;

thisapimodel = models;
thisapiurl = apiurl;

function wirtestapi(mudu,sta){
    var writerStream = null;
    if(mudu=='api'){
        writerStream = fs.createWriteStream(`./src/${mudu}/modules/${models}/index.js`);
    }else{
        writerStream = fs.createWriteStream(`./src/${mudu}/modules/${models}.js`);
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
        console.log(mudu+'写入失败');
    })
}
try{
  await mkreduce(`./src/api/modules/`);
  await mkreduce(`./src/router/modules/`);
  await mkreduce(`./src/store/modules/`);
  const { COPYFILE_EXCL } = fs.constants;

 // 通过使用 COPYFILE_EXCL，如果目标文件存在，则操作将失败。
 let copySrc = path.join( __dirname, '.',  'controller-demo','src','api','controller-common.js');
 let copySrcrou = path.join( __dirname, '.',  'controller-demo','src','router','generate-routes.js');
 let copySrcmap = path.join( __dirname, '.',  'controller-demo','src','router','router-map.js');
 fs.copyFileSync(copySrc, './src/api/controller-common.js', COPYFILE_EXCL);
 fs.copyFileSync(copySrcrou, './src/router/generate-routes.js', COPYFILE_EXCL);
 fs.copyFileSync(copySrcmap, './src/router/router-map.js', COPYFILE_EXCL);
}catch(e){};
if (fs.existsSync(`./src/api/modules/${models}`)) {
    console.log('api该路径已存在');
}else{
    console.log('api该路径不存在');
    fs.mkdir(`./src/api/modules/${models}`,function(){
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
        saveapi({
            "url": apiurl,
            "type": apitype,
            "modules":models,
            "params": JSON.parse(apiparams),
            "name":apiname,
            "wiki":apiwiki,
            "res": JSON.parse(apires)});
        wirtestapi('api',apistr);
    })
    
    return;
}
var readStream=fs.createReadStream(`./src/api/modules/${models}/index.js`);

var str='';/*保存数据*/
var count=0;  /*次数*/
readStream.on('data',function(chunk){
    str+=chunk;
    count++;

})

//读取完成
readStream.on('end',function(chunk){
    // console.log(count);
    // console.log(str);
    var apilistStr = str.slice(0,str.lastIndexOf(']')) + haveDou(str.slice(0,str.lastIndexOf(']')))
+`  {
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
    saveapi({
        "url": apiurl,
        "type": apitype,
        "modules":models,
        "params": JSON.parse(apiparams),
        "name":apiname,
        "wiki":apiwiki,
        "res": JSON.parse(apires)});
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

    thisdiaoyong = apitype+star1.slice(0,1).toUpperCase()+star1.slice(1)+star2.slice(0,1).toUpperCase()+star2.slice(1);
    thisshujucangku = star1+star2.slice(0,1).toUpperCase()+star2.slice(1);


    if (fs.existsSync(`./src/store/modules/${models}.js`)) {
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
    commonRequest('${apitype=="post"?apiurl+"'":apiurl+"?'"+"param(data)"},'${apitype}',data).then(response => {
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

let readStream=fs.createReadStream(`./src/store/modules/${models}.js`);

let str='';/*保存数据*/
let count=0;  /*次数*/
readStream.on('data',function(chunk){
    str+=chunk;
    count++;

})

//读取完成
readStream.on('end',function(chunk){
    // console.log(count);
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
    storelistStr = `import {commonRequest} from '@/api/controller-common'
    `+storeone
    + 'const state = '+storetate.slice(0,storetate.lastIndexOf('}')) + haveDou(storetate.slice(0,storetate.lastIndexOf('}')))
    +`    ${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)}:[],
}
const mutations = `+ storemutation.slice(0,storemutation.lastIndexOf('}'))+ haveDou(storemutation.slice(0,storemutation.lastIndexOf('}')))
    +`    ${apitype.toUpperCase()}_${star1.toUpperCase()+star2.toUpperCase()}:(state,data)=>{
    state.${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)} = data;
},
}
const actions = `+ storeactions.slice(0,storeactions.lastIndexOf('}')) + haveDou(storeactions.slice(0,storeactions.lastIndexOf('}')))
    + `    ${apitype+star1.slice(0,1).toUpperCase()+star1.slice(1)+star2.slice(0,1).toUpperCase()+star2.slice(1)}({ commit, state },data) {
    return new Promise((resolve, reject) => {
    commonRequest('${apitype=="post"?apiurl+"'":apiurl+"?'"+"param(data)"},'${apitype}',data).then(response => {
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
    let readStream=fs.createReadStream(`./src/store/getters.js`);

    let str='';/*保存数据*/
    let count=0;  /*次数*/
    readStream.on('data',function(chunk){
        str+=chunk;
        count++;

    })

    //读取完成
    readStream.on('end',function(chunk){
        // console.log(count);
        // console.log(str); userOrderList: state => state.member.userOrderList,
        let getters1 = str.split('export default ')[0];
        let getters2 = str.split('export default ')[1];
        let getterstr = getters1.slice(0,getters1.lastIndexOf('}')) + haveDou(getters1.slice(0,getters1.lastIndexOf('}')))
        +`    ${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)}: state => state.${models}.${star1+star2.slice(0,1).toUpperCase()+star2.slice(1)},            
}
export default `+getters2;
    let writerStream = fs.createWriteStream(`./src/store/getters.js`);
    writerStream.write(getterstr,'utf8');

    //标记写入完成
    writerStream.end();

    writerStream.on('finish',function(){
        // res.send('hello mocks!');
        
        console.log('getterstr写入完成');
        console.log(`-----------------SUCCESS---------------------
        
        '${thisapiurl}'接口写入完成；
        页面调用接口方法：this.$store.dispatch('${thisapimodel}/${thisdiaoyong}',params).then(res=>{...})
        页面使用数据仓库：...mapGetters(['${thisshujucangku}'])

--------------------------------------------------------------------`);
    })

    //失败
    writerStream.on('error',function(){
        // res.send('hello mocks!');
        console.log('getterstr写入失败');
    })
    })


    //读取失败
    readStream.on('error',function(err){
        console.log(err);

    })
}
}

function askapi(){
    let askobj = {};
    return new Promise((resolve,reject)=>{
        inquirer.prompt({
                type: 'input', // 问题类型，包括input，number，confirm，list，rawlist，password
                name: 'name', 
                message: '请输入接口说明', // 问题
                default: '获取列表', // 默认值
                validate: (input) => {
                    if (input.length > 255) { // 输入验证：name长度不允许超过255
                        return '接口说明超过限制';
                    }
                    return true;
                }        
            }).then(asks=>{
                askobj['name'] = asks.name;
                inquirer.prompt(
                    {
                        type: 'input', // 问题类型，包括input，number，confirm，list，rawlist，password
                        name: 'model', 
                        message: '请输入模块', // 问题
                        default: 'member', // 默认值
                        validate: (input) => {
                            if (input.length > 255) { // 输入验证：name长度不允许超过255
                                return '模块名称超过限制';
                            }
                            return true;
                        }        
                    }).then(ask2=>{
                        askobj['model'] = ask2.model;
                        inquirer.prompt(
                            {
                                type: 'list',
                                name: 'type',
                                message: '请选择请求方式',
                                choices: ['post', 'get'], // 可选选项
                                default: 'post'
                            }).then(as3=>{
                                askobj['type'] = as3.type;
                                resolve(askobj);
                                // askparams().then(as4=>{
                                //     askobj['inparams'] = as4.inparams;
                                //     askoutparams().then(as5=>{
                                //         askobj['outparams'] = as5.outparams;
                                //         resolve(askobj);
                                //     })
                                // })
                                
                            })
                    })
            });
       
    })
    
}

registeCommand('api <api-url>', 'description: 添加Api', {}, (apiUrl)=>{
    // require('../commands/init')(appName);
    api(apiUrl)
    
});    

registeCommand('init <app-name>', 'description: 添加项目', {}, (appName)=>{
    // require('../commands/init')(appName);
    init(appName)
    
}); 


registeCommand('page <page-url>', 'description: 添加Api', {}, (pageUrl)=>{
    // require('../commands/init')(appName);
    pages(pageUrl)
    
});    



program
    .arguments('<command>')
    .action(()=>{
        // eslint-disable-next-line
        console.log(chalk.yellow('无效 vue-controller命令'));
        program.outputHelp();
    });

program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}