# 基于vuex的vue项目自动化构建管理工具


## 全局使用-安装

> npm install -g vue-controller

## 使用

``` bash
# 若还没有vue项目，则使用以下命令构建项目
$ vue-controller init <app-name>

# 进入vue <app-name> 项目根目录下
$ cd <app-name>
$ npm install
$ npm run dev

# 添加api数据源接口
$ vue-controller api /api/url

# 添加mock数据架构 及 mock数据
$ vue-controller mock /api/url

# 添加页面page
$ vue-controller page page-path
```


## vue根目录-安装

### 进入vue 项目根目录下

> npm install vue-controller -S

## 使用

``` bash
# 进入vue 项目根目录下
$ npm install
$ npm run dev

# 添加api数据源接口
$ ./node_modules/.bin/vue-controller api /api/url

# 添加mock数据架构及数据
$ ./node_modules/.bin/vue-controller mock /api/url

# 添加页面page
$ ./node_modules/.bin/vue-controller page page-path
```