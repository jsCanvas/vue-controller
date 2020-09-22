#!/usr/bin/env node
// const validateProjectName = require('validate-npm-package-name');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const inquirer = require('inquirer');

function checkAppName(appName){
    let appPath = path.join(cwd, appName);
    // let {validForNewPackages, warnings} = validateProjectName( path.parse(appName).base );
    // if (!validForNewPackages) {
    // console.log(chalk.red('Error: 项目名称不能包含大写字母'));
    // process.exit(1);
    // }
    return appPath;
}

    const askTemplate = () => {
        return inquirer.prompt({
        type: 'list',
        name: 'appTplName',
        message: '请选择模板',
        choices: [
                {
                name: '后台管理',
                value: 'controller-demo'
                }
            ]
        });
        };
        
        function copyTemplate(data){
        let { appTplName, appPath} = data;
        let tplSrc = path.join( __dirname, '.',  appTplName);
        let appName = path.basename(appPath);
        if (fs.existsSync(appPath)) {
        console.log(chalk.red(`目录 ${appName} 已存在\n`));
        process.exit(1);
        }
        
        fs.ensureDirSync(appPath);
        fs.copySync(tplSrc, appPath);
        }
        
        function outputLog({ appName, appPath }) {
        console.log(
        `\n项目 ${chalk.green(appName)} 创建成功, 路径: ${chalk.green(
        appPath
        )}\n`
        );
        }
async function init(appName){
    const appPath = checkAppName(appName);
    const { appTplName } = await askTemplate();
    copyTemplate({ appPath, appTplName});
    outputLog({ appName, appPath });
    }

module.exports = init;