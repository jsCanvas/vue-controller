#!/usr/bin/env node
'use strict';
const fs = require('fs');
const inquirer = require('inquirer');

const chalk = require('chalk');
const semver = require('semver');
const program = require('commander');
const templates = require('./consts/templates');
const apiarrlist = require('./data/mocks').mock;

const askapiorigin = () => {
    let apils=[];
    apiarrlist.map((item,index)=>{
        let apiobj = {
            name:item.url,
            value:index
        };
        apils.push(apiobj);
    })
    return inquirer.prompt({
        type: 'list',
        name: 'api',
        message: '请选择数据源',
        choices: apils
    });
};
const askTemplate = () => {
    return inquirer.prompt({
        type: 'list',
        name: 'pageTemplate',
        message: '请选择模板',
        choices: templates
    });
};
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
function haveDou(str){
    if(str.lastIndexOf('}')<str.lastIndexOf(',')){
        return '';
    }else if(str.lastIndexOf('}')>str.lastIndexOf(',')){
        return ',';
    }
}
checkNodeVersion('8.6.0');

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

async function pages(pageUrl){
    const  answers  = await askpage();

    // model
    // name
    // modelname

    /**更新数据源数据 */
    let newmock = await readpage(`./src/api/modules/${apiarrlist[answers.api].modules}/index.js`);
    let newarr = JSON.parse(JSON.stringify(newmock.split('export default ')[1]));
    // saveapi(JSON.parse(newarr))
    let nenenarr = eval(`(function(){
        return ${newarr}
    })()`)
    nenenarr.map(item=>{
        if(item.url == apiarrlist[answers.api].url){
            apiarrlist[answers.api] = item;
        }
    });

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
            if(mudu=='route'){
                console.log(`----------------------SUCCESS------------------------
        页面${models}-${pageUrl}写入完成：

            页面文件PATH：@/src/views/${models}-manager/${pageUrl}/index.vue
            页面访问路径：http://localhost:port/#/${models}-manager/${pageUrl}
            MENU菜单名称：【${modesname}】--> 【${pagename}】
            MENU菜单配置：【${models}-manager】 --> 【${pageUrl}】
                
---------------------------------------------------------`);
            }
        })
    
        //失败
        writerStream.on('error',function(){
            // res.send('hello page!');
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
            // console.log(count);
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


let models = answers.model;
let pagepath = pageUrl;
let pagename = answers.name;
let modesname = answers.modelname;
let pagetemplate = answers.pageTemplate;
let apicheck = answers.api;
if (fs.existsSync(`./src/views/${models}-manager`)) {
    console.log('page model该路径已存在');
    /**判断页面是否存在 */
    if (fs.existsSync(`./src/views/${models}-manager/${pagepath}`)) {
        console.log('page该路径已存在');
    }else{
        console.log('page该路径不存在');
        fs.mkdir(`./src/views/${models}-manager/${pagepath}`,function(){
            let thispage = require(`./pagelists/${pagetemplate}`)(models,pagepath,apiarrlist[apicheck]);
            wirtestpage(`./src/views/${models}-manager/${pagepath}/index.vue`,'page',thispage).then(rel=>{
                // res.send('hello pages!');
                readpage(`./src/router/modules/${models}/index.js`).then(routestr=>{
                    let routes1 = routestr.split('export default ')[0];
                    let routes2 = routestr.split('export default ')[1];
                    let changeroute = routes1.slice(0,routes1.lastIndexOf(']'))+haveDou(routes1.slice(0,routes1.lastIndexOf(']')))
+`  {
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
                    wirtestpage(`./src/router/modules/${models}/index.js`,'route',changeroute).then(oksl=>{
                        // res.send('hello pages!');
                    });
                    
                });
            });
        });
        return;
    }
}else{
    console.log('page model该路径不存在');
    fs.mkdir(`./src/views/${models}-manager`,function(){
        fs.mkdir(`./src/views/${models}-manager/${pagepath}`,function(){
            let thatpage = require(`./pagelists/${pagetemplate}`)(models,pagepath,apiarrlist[apicheck]);
            wirtestpage(`./src/views/${models}-manager/${pagepath}/index.vue`,'page',thatpage).then(rel=>{
                // 写模块路由
                fs.mkdir(`./src/router/modules/${models}`,function(){
                    let thismodelstr = nopageroute(models,modesname,pagepath,pagename);
                    wirtestpage(`./src/router/modules/${models}/index.js`,'route',thismodelstr).then(oksl=>{
                        // res.send('hello pages!');
                    })
                });
            });
        });
    });
    
    return;
};




function askpage(){
    let askobj = {};
    return new Promise((resolve,reject)=>{
        inquirer.prompt({
                type: 'input', // 问题类型，包括input，number，confirm，list，rawlist，password
                name: 'name', 
                message: '请输入页面菜单名称', // 问题
                default: '默认不展示', // 默认值
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
                                type: 'input',
                                name: 'modelname',
                                message: '请输入模块菜单名称',
                                default: '默认菜单', // 默认值
                                validate: (input) => {
                                    if (input.length > 255) { // 输入验证：name长度不允许超过255
                                        return '模块菜单名称超过限制';
                                    }
                                    return true;
                                }
                            }).then(as3=>{
                                askobj['modelname'] = as3.modelname;
                                askTemplate().then(as4=>{
                                    askobj['pageTemplate'] = as4.pageTemplate;
                                    // if(as4.pageTemplate == 'black'){
                                    //     resolve(askobj);
                                    // }else{
                                        askapiorigin().then(as5=>{
                                            askobj['api'] = as5.api;
                                            resolve(askobj);
                                        })
                                    // }
                                    
                                })
                                
                            })
                    })
            });
       
    })
    
}

}


// registeCommand('page <page-url>', 'description: 添加Api', {}, (pageUrl)=>{
//     // require('../commands/init')(appName);
//     pages(pageUrl)
    
// });    



// program
//     .arguments('<command>')
//     .action(()=>{
//         // eslint-disable-next-line
//         console.log(chalk.yellow('无效 nanachi 命令'));
//         program.outputHelp();
//     });

// program.parse(process.argv);
// if (!process.argv.slice(2).length) {
//     program.outputHelp();
// }

module.exports = pages;