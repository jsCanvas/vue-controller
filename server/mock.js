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

async function mockapi(apiUrl){
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
        writerStream = fs.createWriteStream(`./mock/modules/${models}/index.js`);
    }else{
        writerStream = fs.createWriteStream(`./src/${mudu}/modules/${models}.js`);
    }
    writerStream.write(sta,'utf8');

    //标记写入完成
    writerStream.end();

    writerStream.on('finish',function(){
        // res.send('hello mocks!');
        if(mudu=='api'){
        // apistore();
        // res.send('hello mocks!');
                
        console.log('mock写入完成');
        console.log(`-----------------SUCCESS---------------------
        
        '${thisapiurl}'mock数据写入完成；
        请在vue.config/webpack 如下配置使用：
        devServer: {
                    proxy: {
                        '/openapi': {
                            // target: "http://$-{OPENAPI_PROXY_SERVER_HOST}/", // 接口的域名
                            target: "http://127.0.0.1:$-{port}/mock"
                            changeOrigin: true,
                            onProxyReq(proxyReq, req, res) {
                                proxyReq.setHeader('x-forwarded-host', OPENAPI_PROXY_SERVER_HOST)
                            },
                            // target: 'http://127.0.0.1:80',
                            bypass: function(req, res, proxyOptions) {
                              // 需要走代理的 mock api 列表(可以只包含前面一部分--表示某一个模块的api全部都需要mock)
                              const mockUrls = [ 
                                /*
                                '/contract/fix/findPage',
                                '/file/task/download/findPage',
                                '/contract/fix/download/findPage',
                                '/file/task/download',
                                '/contract/fix/downloadBatch',
                                */
                              ];
                              const matchedMockUrl = mockUrls.find(mockUrl => req.originalUrl.match("$-{process.env.VUE_APP_BASE_API}$-{mockUrl}"));
                              // 请求的 url 为 mock api，跳过代理，返回mock api的地址
                              if (matchedMockUrl) {
                                console.log('matchedMockUrl: ', matchedMockUrl);
                                return req.originalUrl.replace('/openapi', '/mock'); 
                              }
                            },
                            pathRewrite: {
                              ['^' + '/openapi']: ''
                            }
                        },
                        after: require('./mock/mock-server.js')
                }
        
        --------------------------------------------------------------------`);
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
  await mkreduce(`./mock/`);
  await mkreduce(`./mock/modules/`);
  const { COPYFILE_EXCL } = fs.constants;

 // 通过使用 COPYFILE_EXCL，如果目标文件存在，则操作将失败。
 let copySrc = path.join( __dirname, '.',  'controller-demo','mock','index.js');
 let copySrcrou = path.join( __dirname, '.',  'controller-demo','mock','mock-server.js');
 fs.copyFileSync(copySrc, './mock/index.js', COPYFILE_EXCL);
 fs.copyFileSync(copySrcrou, './mock/mock-server.js', COPYFILE_EXCL);
}catch(e){};
if (fs.existsSync(`./mock/modules/${models}`)) {
    console.log('api该路径已存在');
}else{
    console.log('api该路径不存在');
    fs.mkdir(`./mock/modules/${models}`,function(){
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
var readStream=fs.createReadStream(`./mock/modules/${models}/index.js`);

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
}

module.exports = mockapi;