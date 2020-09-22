<template>
  <el-container>
    <el-aside width="200px">
      <Aside></Aside>
    </el-aside>
    <el-container>
      <Header></Header>
      <!-- 相当于router-view 组件映射到跟目录 -->
      <el-main>
        <nuxt></nuxt>
      </el-main>
      <el-footer>
        <el-row>
            <el-col>
                <el-button @click="pageDialog=true">
                  添加页面
                </el-button>
                <el-button @click="apiDialog=true">
                  添加API
                </el-button>
                <el-button>
                  添加store
                </el-button>
            </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <ApiForm @close="apiDialog=false" :ApiDialog="apiDialog"></ApiForm>
    <PageForm @close="pageDialog=false" :PageDialog="pageDialog"></PageForm>
  </el-container>
</template>

<script>
// 引入公共组件
import Header from "../components/header";
import Aside from "../components/aside";
import ApiForm from "../components/user/ApiForm";
import PageForm from "../components/user/PageForm";
export default {
  data(){
    return{
      apiDialog:false,
      pageDialog: false
    }
  },
  components: {
    Header,
    Aside,
    ApiForm,
    PageForm,
  }
};
</script>

<style lang="less">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}
ul,
li,
ol {
  list-style: none;
}
a {
  text-decoration: none;
  color: inherit;
}
em,
i {
  font-style: normal;
}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    min-height: calc(100vh - 140px);
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
